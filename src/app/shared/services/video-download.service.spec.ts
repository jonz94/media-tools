import { TestBed } from '@angular/core/testing';
import { VideoDownloadService } from './video-download.service';

describe('VideoDownloadService', () => {
  let service: VideoDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
