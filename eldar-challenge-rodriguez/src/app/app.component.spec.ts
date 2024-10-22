import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  beforeEach(async () => {
    let messageServiceSpy = jasmine.createSpy('MessageService')
    await TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageServiceSpy }
      ],
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
