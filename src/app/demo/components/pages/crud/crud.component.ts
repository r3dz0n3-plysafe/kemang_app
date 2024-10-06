import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { KemangService } from "src/app/demo/service/kemang.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    templateUrl: './crud.component.html',
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

	currentData: any[] = [];

    submitted: boolean = false;

    statuses: any[] = [];

	formInputSewa: FormGroup;

	selectedSewaId: any;
	deleteSewaId: any;
	btnLoading: boolean;
	loadingTable: boolean;
	metadata: any;
	currentLazyEvent: TableLazyLoadEvent;

	constructor(
		private messageService: MessageService,
		private kemangService: KemangService,
		private fb: FormBuilder,
	) {
	}

    ngOnInit() {
	    this.createForm();
    }

	createForm() {
		this.formInputSewa = this.fb.group({
			'kmg_floor': [null, Validators.required],
			'kmg_unit': [null, Validators.required],
			'kmg_periode': [null, Validators.required],
			'kmg_price': [null, Validators.required],
			'kmg_agent': [null, Validators.required],
			'kmg_keterangan': [null],
		})
	}

    openNew() {
	    this.formInputSewa.reset();
	    this.selectedSewaId = null;
        this.submitted = false;
        this.productDialog = true;
    }

	editProduct(product: any) {
		this.selectedSewaId = product.kmg_id;
		this.formInputSewa.patchValue(product)
        this.productDialog = true;
    }

	deleteProduct(product: any) {
        this.deleteProductDialog = true;
		this.deleteSewaId = product.kmg_id;
    }

    confirmDelete() {
	    this.btnLoading = true;
	    this.kemangService.deleteSewa(this.deleteSewaId).subscribe({
		    next: value => {
			    this.messageService.add({
				    severity: 'success',
				    summary: 'Successful',
				    detail: 'Sewa Deleted',
				    life: 3000
			    });
			    this.loadTableData(this.currentLazyEvent);
			    this.btnLoading = this.deleteProductDialog = false;
		    },
		    error: error => {
			    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error', life: 3000});
			    this.btnLoading = false;
		    }
	    })
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
	    this.btnLoading = false;
    }

    saveProduct() {
	    this.btnLoading = this.submitted = true;

	    if (this.formInputSewa.valid) {
		    if (this.selectedSewaId) {
			    this.kemangService.editSewa(this.selectedSewaId, this.formInputSewa.getRawValue()).subscribe({
				    next: value => {
					    this.messageService.add({
						    severity: 'success',
						    summary: 'Successful',
						    detail: 'Sewa Updated',
						    life: 3000
					    });
					    this.loadTableData(this.currentLazyEvent);
					    this.hideDialog();
				    },
				    error: error => {
					    console.log(error)
					    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error', life: 3000});
					    this.btnLoading = false;
				    }
			    })
            } else {
			    this.kemangService.postSewa(this.formInputSewa.getRawValue()).subscribe({
				    next: value => {
					    this.messageService.add({
						    severity: 'success',
						    summary: 'Successful',
						    detail: 'Sewa Created',
						    life: 3000
					    });
					    this.loadTableData(this.currentLazyEvent);
					    this.hideDialog();
				    },
				    error: error => {
					    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error', life: 3000});
					    this.btnLoading = false;
				    }
			    })
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

	getSuggestion(field: string) {
		return this.currentData.reduce((acc: string[], item: any) => {
			if (!acc.includes(item[field])) {
				acc.push(item[field]); // Add unique items to the accumulator
			}
			return acc;
		}, []);
	}

	loadTableData(event: TableLazyLoadEvent) {
		this.loadingTable = true;
		this.currentLazyEvent = event;

		const params: any = {
			page: (event?.first / event?.rows) + 1,
			perPage: event?.rows,
			sortField: event?.sortField,
			sortOrder: event?.sortOrder,
		};

		if (event?.filters) {
			const filters = event.filters;
			if (filters['global']) {
				params.globalFilter = JSON.stringify(filters['global']);
			}
			delete filters['global'];

			params.filters = JSON.stringify(filters);
		}

		if (event?.multiSortMeta) {
			params.multiSortMeta = JSON.stringify(event.multiSortMeta);
		}

		this.kemangService.getSewa(params)
		.toPromise()
		.then(res => {
			this.currentData = res.results.data;
			this.metadata = res.results.metadata;

			this.loadingTable = false;
		});
	}
}
