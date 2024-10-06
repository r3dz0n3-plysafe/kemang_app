import { Component, OnInit } from '@angular/core';
import { FilterMatchMode, FilterService, PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

	constructor(private primengConfig: PrimeNGConfig, private filterService: FilterService) {
	}

    ngOnInit() {
        this.primengConfig.ripple = true;
	    this.primengConfig.setTranslation({
		    dateFormat: "dd M yy",
	    });
	    this.primengConfig.filterMatchModeOptions = {
		    text: [
			    FilterMatchMode.CONTAINS,
			    FilterMatchMode.NOT_CONTAINS,
			    FilterMatchMode.STARTS_WITH,
			    FilterMatchMode.ENDS_WITH,
			    FilterMatchMode.EQUALS,
			    FilterMatchMode.NOT_EQUALS
		    ],
		    numeric: [
			    FilterMatchMode.EQUALS,
			    FilterMatchMode.NOT_EQUALS,
			    FilterMatchMode.LESS_THAN,
			    FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
			    FilterMatchMode.GREATER_THAN,
			    FilterMatchMode.GREATER_THAN_OR_EQUAL_TO
		    ],
		    date: [
			    FilterMatchMode.DATE_IS,
			    FilterMatchMode.DATE_IS_NOT,
			    FilterMatchMode.DATE_BEFORE,
			    FilterMatchMode.DATE_AFTER
		    ]
	    };
    }
}
