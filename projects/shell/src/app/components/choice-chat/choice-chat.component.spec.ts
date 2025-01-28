import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceChatComponent } from './choice-chat.component';

describe('ChoiceChatComponent', () => {
  let component: ChoiceChatComponent;
  let fixture: ComponentFixture<ChoiceChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
