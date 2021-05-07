import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import{FormControl}from '@angular/forms';
import { Validators } from '@angular/forms';

export class Facture {
  constructor(
    public id_fact: number,
    public datefacture: Date,
    public adresse: string,
    public prix: number,
    public numBC: string
  ) { }
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']

})
export class NotificationsComponent implements OnInit {
  [x: string]: any;

  facture: Facture[];
  closeResult: string;
  editForm: FormGroup;
  private deleteID: number;
  //public currencyInput = document.querySelector('input[type="currency"]');
  // public currency = 'XOF'; // https://www.currency-iso.org/dam/downloads/lists/list_one.xml



  constructor(private httpclient: HttpClient,
    private modalService: NgbModal,
    private formb: FormBuilder) { }


  ngOnInit() {
    this.getfactures();
    this.editForm = this.formb.group({
      id_fact: [''],
      datefacture: [''],
      adresse: new FormControl('', { validators: [Validators.required], updateOn: 'submit'}),
      prix: [''],
      numBC: ['']
    });

    /*   
    // format inital value
   this.onBlur({target:this.currencyInput})
   
       // bind event listeners
       this.currencyInput.addEventListener('focus', this.onFocus)
       this.currencyInput.addEventListener('blur', this.onBlur)
   */
  }

  getfactures() {
    this.httpclient.get<any>('http://localhost:8001/factures').subscribe(response => {
      console.log(response);
      this.facture = response;
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
