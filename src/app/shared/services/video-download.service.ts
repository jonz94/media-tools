import { Injectable, NgZone } from '@angular/core';
import * as childProcess from 'child_process';
import { remote, shell } from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { BehaviorSubject } from 'rxjs';

const youtubeDl = window.require('youtube-dl');
const ffmpegPath = window
  .require('@ffmpeg-installer/ffmpeg')
  .path.replace('app.asar', 'app.asar.unpacked');

@Injectable({
  providedIn: 'root',
})
export class VideoDownloadService {
  readonly STORAGE_OUTPUT_DIRECTORY_KEY = 'output.directory';

  private shell: typeof shell;
  private remote: typeof remote;
  private childProcess: typeof childProcess;
  private fs: typeof fs;
  private os: typeof os;
  private path: typeof path;

  outputDirectory = '';
  isDownloading$ = new BehaviorSubject(false);
  spawnOutput$ = new BehaviorSubject('');

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor(private zone: NgZone) {
    // Conditional imports
    if (this.isElectron) {
      this.shell = window.require('electron').shell;
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.os = window.require('os');
      this.path = window.require('path');

      // If you wan to use remote object, please set enableRemoteModule to true in main.ts
      this.remote = window.require('electron').remote;

      this.initializeYoutubeDl();
      this.initializeOutoutDirectory();
    }
  }

  private async initializeYoutubeDl() {
    const binDir = this.path.join(this.os.homedir(), '.media-tools-bin');
    const bin = this.path.join(
      binDir,
      `youtube-dl${this.os.platform() === 'win32' ? '.exe' : ''}`,
    );

    try {
      if (!this.fs.existsSync(binDir)) {
        this.fs.mkdirSync(binDir);
      }

      this.fs.copyFileSync(youtubeDl.getYtdlBinary(), bin);
    } catch (error) {
      console.error(error);
    }

    youtubeDl.setYtdlBinary(bin);
  }

  private initializeOutoutDirectory() {
    this.outputDirectory =
      this.load() ?? this.path.join(this.os.homedir(), 'video-downloads');
  }

  changeOutputDirectory() {
    const defaultDirectory = this.path.join(
      this.os.homedir(),
      'video-downloads',
    );

    const selectedDirectory = this.remote.dialog.showOpenDialogSync({
      properties: ['openDirectory'],
    })[0];

    const directory = selectedDirectory ?? defaultDirectory;

    this.save(directory);

    this.outputDirectory = directory;
  }

  downloadVideo(url: string) {
    if (!this.isElectron) {
      return;
    }

    const outputDir = this.outputDirectory;

    if (!this.fs.existsSync(outputDir)) {
      try {
        this.fs.mkdirSync(outputDir);
      } catch (error) {
        console.error(error);
      }
    }

    const spawn = this.childProcess.spawn;

    const process = spawn(youtubeDl.getYtdlBinary(), [
      url,
      '-f',
      'bestvideo+bestaudio',
      '--ffmpeg-location',
      ffmpegPath,
      '--hls-prefer-ffmpeg',
      '-o',
      this.path.join(outputDir, '%(title)s-%(id)s.%(ext)s'),
    ]);

    process.stdout.on('data', (data) => {
      let output = `${data}`;
      const outputWhileDownloading = output.split('[download]')[1];

      if (outputWhileDownloading) {
        output = '[download]' + outputWhileDownloading;

        if (output.includes('Unknown')) {
          return;
        }
      }

      console.log('stdout', output);

      this.zone.run(() => this.spawnOutput$.next(output));
      this.zone.run(() => this.isDownloading$.next(true));
    });

    process.stderr.on('data', (data) => {
      console.log('stderr', `${data}`);
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log('Download completed');
        this.shell.openPath(outputDir);
      }

      console.log(`spawnDownload() exited with code ${code}`);
      this.zone.run(() => this.spawnOutput$.next(''));
      this.zone.run(() => this.isDownloading$.next(false));
    });
  }

  downloadSubtitle(url: string, openPath = true, auto = true) {
    if (!this.isElectron) {
      return;
    }

    const options = {
      // Write automatic subtitle file (youtube only)
      auto,
      // Downloads all the available subtitles.
      all: false,
      // Subtitle format. YouTube generated subtitles
      // are available ttml or vtt.
      format: 'vtt',
      // Languages of subtitles to download, separated by commas.
      lang: 'zh-Hant',
      // The directory to save the downloaded files in.
      cwd: this.outputDirectory,
    };

    const outputDir = options.cwd;

    if (!this.fs.existsSync(outputDir)) {
      try {
        this.fs.mkdirSync(outputDir);
      } catch (error) {
        console.error(error);
      }
    }

    youtubeDl.getSubs(url, options, (error) => {
      if (error) {
        return console.error(error);
      }

      const spawn = this.childProcess.spawn;

      if (openPath) {
        this.shell.openPath(outputDir);
      }

      this.getFiles(outputDir)
        .filter((file) => /\.vtt/.test(file))
        .forEach((file) => {
          const inputFile = this.path.join(outputDir, file);
          const outputFile = this.path.join(
            outputDir,
            file.replace(/\.vtt/, '.srt'),
          );
          const process = spawn(ffmpegPath, [
            '-loglevel',
            'quiet',
            '-n',
            '-i',
            inputFile,
            outputFile,
          ]);

          process.stdout.on('data', (data) => {
            console.log('ffmpeg stdout', `${data}`);
          });

          process.stderr.on('data', (data) => {
            console.log('ffmpeg stderr', `${data}`);
          });

          process.on('close', (code) => {
            if (code === 0) {
              console.log('Download completed');
            }

            console.log(`ffmpeg exited with code ${code}`);

            try {
              this.fs.unlinkSync(inputFile);
            } catch (error) {
              console.error('unlink .vtt', error);
            }
          });
        });
    });
  }

  async exec(url: string, args: string[] = [], options = {}) {
    if (!this.isElectron) {
      return Promise.reject('only support electron');
    }

    return new Promise((resolve, reject) => {
      youtubeDl.exec(url, args, options, (error, output) => {
        if (error) {
          reject(error);
        }

        resolve(output);
      });
    });
  }

  private getFiles(dir) {
    return this.fs.readdirSync(dir).filter((file) => {
      return this.fs.statSync(`${dir}/${file}`).isFile();
    });
  }

  private load() {
    return localStorage.getItem(this.STORAGE_OUTPUT_DIRECTORY_KEY);
  }

  private save(value: string) {
    localStorage.setItem(this.STORAGE_OUTPUT_DIRECTORY_KEY, value);
  }
}
