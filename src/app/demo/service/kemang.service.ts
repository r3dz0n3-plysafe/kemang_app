import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: 'root',
})
export class KemangService {
	baseUrl = environment.baseUrl;

	constructor(private http: HttpClient) {
	}

	getSewa(queryParams: any = {}) {
		return this.http.get<any>(this.baseUrl + 'sewa', {params: queryParams});
	}

	postSewa(value: any) {
		return this.http.post(this.baseUrl + 'sewa/create', value);
	}

	editSewa(id: any, value: any) {
		return this.http.post(this.baseUrl + 'sewa/edit/' + id, value);
	}

	deleteSewa(id: any) {
		return this.http.get(this.baseUrl + 'sewa/delete/' + id);
	}

}
