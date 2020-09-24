import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { VideoDownloaderPage } from './video-downloader.page';

describe('VideoDownloaderPage', () => {
  let component: VideoDownloaderPage;
  let fixture: ComponentFixture<VideoDownloaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoDownloaderPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoDownloaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
