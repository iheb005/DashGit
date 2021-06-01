import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import{FormControl}from '@angular/forms';
import { Validators } from '@angular/forms';
import {Observable, forkJoin} from 'rxjs';


export class Facture {
  constructor(
    public id_fact: number,
    public datefacture: Date,
    public adresse: string,
    public prix: number,
    public numBC: string
  ) { }
};
export class Fournisseur{
constructor(
  public ABAN8: number,
  public ABTAX: string,
  public ABALPH: string,
  public ABDC: string 
){}
}
export class Cmdefrs{
  constructor(
    public PHDOCO: number,
    public PHAN8: number,
    public PHOTOT: number
  ){}
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']

})
@Injectable()
export class NotificationsComponent implements OnInit {
  [x: string]: any;

  nvliste:any[];
  resData: any;
  facture: Facture[];
  fournisseur: Fournisseur[];
  cmdefrs: Cmdefrs[];
 // fournisseur: any[];
  closeResult: string;
  editForm: FormGroup;
  private deleteID: number;
  //public currencyInput = document.querySelector('input[type="currency"]');
  // public currency = 'XOF'; // https://www.currency-iso.org/dam/downloads/lists/list_one.xml

  constructor(private httpclient: HttpClient,
    private modalService: NgbModal,
    private formb: FormBuilder) {
     /* this.getJSON().subscribe(data => {
        console.log(data);
    });
    */
     }

 /*   public getJSON(): Observable<any> {
      return this.http.get("./fournisseurs.json");
  }
  */
  ngOnInit() {
    const reqHeader = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
    // const bill= this.getfactures();
    // const frs= this.getfournisseurs();
   this.getData();
   
    //this.getfactures();
  //this.getfournisseurs();

//this.forkJoin();

    this.editForm = this.formb.group({
      id_fact: [''],
      datefacture: [''],
      adresse: new FormControl('', { validators: [Validators.required], updateOn: 'submit'}),
      prix: [''],
      numBC: ['']
    });
 
    // forkJoin([bill,frs]).subscribe(res => {

    // console.log();
    // this.bill=res[0];
    // this.frs=res[1];

    // })
     
  /*  this.httpClient.get("fournisseurs.json").subscribe(data =>{
      console.log(data);
      this.fournisseur = data;
    })
    */

  }

  
  getfactures() {
    // this.httpclient.get<any>('http://localhost:8001/factures').subscribe(response => {
    //   console.log(response);
    //   this.facture = response;
    // })
    this.httpclient.get<any>('http://localhost:8001/factures').subscribe(response => {
      console.log(response);
      this.facture = response;
    })
  }

  getData() {
    forkJoin([
      this.httpclient.get<any>('http://localhost:8001/factures'),
      this.httpclient.get<any>('http://localhost:3000/fournisseurs'), //observable 2
      this.httpclient.get<any>('http://localhost:4000/cmdefrs'),
    ]).subscribe(([response1, response2,response3]) => {
      
      this.resData = [response1, response2,response3];
      this.facture = response1;
      this.fournisseur= response2;
      this.cmdefrs= response3;
      console.log();
    }
    )
  }

  getcmdefrs(){
    this.httpclient.get<any>('http://localhost:4000/cmdefrs').subscribe(response => {
      console.log(response);
      this.cmdefrs = response;
    })
  }

  getfournisseurs() {
    // this.httpclient.get<any>('http://localhost:8001/fournisseurs').subscribe(response2 => {
    //   console.log(response2);
    //   this.fournisseur = response2;
    // })
    this.httpclient.get<any>('http://localhost:3000/fournisseurs').subscribe(response2 => {
      console.log(response2);
      this.fournisseur = response2;
    })
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `closed with ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    }
    else {
      return `with : ${reason}`;
    }
  }
  onSubmit(f: NgForm) {
    const url = 'http://localhost:8001/addfacture';
    this.httpclient.post(url, f.value).subscribe((result) => {
      this.ngOnInit();
    });
    this.modalService.dismissAll();
  }

  openDetails(targetModal, facture: Facture) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    document.getElementById('datef').setAttribute('value', facture.datefacture.toString());
    document.getElementById('adr').setAttribute('value', facture.adresse);
    document.getElementById('price').setAttribute('value', facture.prix.toString());
    document.getElementById('nbc').setAttribute('value', facture.numBC);

  }

  openEdit(targetModal, facture: Facture) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue({
      id_fact: facture.id_fact,
      datefacture: facture.datefacture,
      adresse: facture.adresse,
      prix: facture.prix,
      numBC: facture.numBC
    });
  }
  onSave() {
    const editURL = 'http://localhost:8001/updfacture/' + this.editForm.value.id_fact;
    console.log(this.editForm.value);
    this.httpclient.put(editURL, this.editForm.value).subscribe((results) => {
      this.ngOnInit();
      // this.refresh();
      this.modalService.dismissAll();
    })
  }

  openDelete(targetModal, facture: Facture) {
    this.deleteID = facture.id_fact;
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });
  }
  
  onDelete() {
    const deleteURL = 'http://localhost:8001/deletefact/' + this.deleteID ;
    this.httpclient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
  /*
  //currency amount (prix)
   localStringToNumber( s ){
    return Number(String(s).replace(/[^0-9.-]+/g,""))
  }
  
   onFocus(e){
    var value = e.target.value;
    e.target.value = value ? this.localStringToNumber(value) : ''
  }
  
   onBlur(e){
    var value = e.target.value
  
    var options = {
        maximumFractionDigits : 2,
        currency              : this.currency,
        style                 : "currency",
        currencyDisplay       : "symbol"
    }
    
    e.target.value = (value || value === 0) 
      ? this.localStringToNumber(value).toLocaleString(undefined, options)
      : ''
  }
  */

}
function testforkJoin() {
  throw new Error('Function not implemented.');
}

