import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/demo/service/product.service';
import { KemangService } from "../../../service/kemang.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

	products: any[] = [];

    submitted: boolean = false;

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];
	formInputSewa: FormGroup;

	selectedSewaId: any;
	deleteSewaId: any;
	btnLoading: boolean;
	loadingTable: boolean;

	constructor(
		private productService: ProductService,
		private messageService: MessageService,
		private kemangService: KemangService,
		private fb: FormBuilder,
	) {
	}

    ngOnInit() {
	    this.kemangService.getSewa().toPromise().then(data => this.products = data);

	    this.createForm();
    }

	createForm() {
		this.formInputSewa = this.fb.group({
			'kmg_floor': [null, Validators.required],
			'kmg_unit': [null, Validators.required],
			'kmg_periode': [null, Validators.required],
			'kmg_price': [null, Validators.required],
			'kmg_agent': [null, Validators.required],
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
			    this.reloadTable();
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
					    this.reloadTable();
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
					    this.reloadTable();
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

	reloadTable() {
		this.loadingTable = true;
		this.kemangService.getSewa().toPromise().then(data => {
			this.products = data
			this.loadingTable = false;
		});
	}

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

	getSuggestion(field: string) {
		let data = [];
		this.products.forEach((item: any) => {
			data.push(item[field])
		})
		return data;
	}
}
