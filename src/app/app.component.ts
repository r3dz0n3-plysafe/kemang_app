import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit {

    constructor(private primengConfig: PrimeNGConfig) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }

	ngAfterViewInit(): void {
		console.log('Toast is ready to use.');
	}
}
