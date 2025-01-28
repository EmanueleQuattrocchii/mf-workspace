import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionChatComponent } from './session-chat.component';

describe('SessionChatComponent', () => {
  let component: SessionChatComponent;
  let fixture: ComponentFixture<SessionChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
