import { Component } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'loading-screen-component',
  standalone: true,
  imports: [LottieComponent],
  providers: [],
  templateUrl: './loading-screen.component.html',
})
export class LoadingScreenComponent {
  options: AnimationOptions = {
    path: '/assets/loading_animation.json',
    loop: true,
    renderer: 'svg',
  };
}
