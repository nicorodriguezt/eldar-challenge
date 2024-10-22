import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../../services/auth.service';
import { By } from '@angular/platform-browser';

describe('NavBarComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserName', 'logout']);
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy }
      ],
      imports: [NavBarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shuld have the user name in the nav bar', () => {
    authServiceSpy.getUserName.and.returnValue('test@test.com')
    fixture.detectChanges();
    const navBarComponent: HTMLElement = fixture.nativeElement;
    expect(navBarComponent.textContent).toContain('test@test.com')
  });

  it('shuld call logout function', () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1)
  });

});
