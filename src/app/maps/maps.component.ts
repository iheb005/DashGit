import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';



export class Structure{
    constructor(
        public id_struct: number,
        public nom : string,
        public mail: string
    ){}
}


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

    structure : Structure[];
    closeResult: string;
    editForm : FormGroup;
    //myForm: FormGroup;
    private deleteID: number;
    

  constructor( private httpclient:HttpClient,
    private modalService: NgbModal,
    private formb: FormBuilder,
    private changeDetectorRefs:ChangeDetectorRef) { }

  ngOnInit() {
    this.getStructures();
    this.refresh();
   /* this.myForm = new FormGroup({
        "nom": new FormControl(null),
        "mail":new FormControl(null, Validators.email)
    })*/

    //ngControl error
    this.editForm = this.formb.group({
        id_struct :[''],
        nom : [''],
        mail : ['']
    });
  }

  refresh(){
    this.changeDetectorRefs.detectChanges();
      }


  getStructures(){
    this.httpclient.get<any>('http://localhost:8001/structures').subscribe(response =>{
        console.log(response);
        this.structure = response;
    })
}

    open(content){
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `closed with ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

   private getDismissReason(reason: any): string{
if(reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
} else{
    return ` with : ${reason}`;
}
    }

    onSubmit(f:NgForm){
        const url = 'http://localhost:8001/addstruct';
        this.httpclient.post(url,f.value).subscribe((result) =>{
           // this.ngOnInit(); //refresh table
            this.refresh();
        });
        this.modalService.dismissAll(); //dismiss modal
    }

openDetails(targetModal, structure: Structure){
this.modalService.open(targetModal, {
    centered: true,
    backdrop: 'static',
    size: 'lg'
});
document.getElementById('name').setAttribute('value',structure.nom);
document.getElementById('mail1').setAttribute('value',structure.mail);
}

openEdit(targetModal, structure:Structure){
this.modalService.open(targetModal, {
    centered:true,
    backdrop: 'static',
    size: 'lg'
});
this.editForm.patchValue({
    id_struct: structure.id_struct,
    nom: structure.nom,
    mail: structure.mail
});
}

onSave(){
    const editURL='http://localhost:8001/updstructure/' +this.editForm.value.id_struct;
    console.log(this.editForm.value);
    this.httpclient.put(editURL, this.editForm.value).subscribe((results)=>{
       // this.ngOnInit();
        this.refresh();
        this.modalService.dismissAll();
    })
}

openDelete(targetModal, structure:Structure){
    this.deleteID =structure.id_struct;
    this.modalService.open(targetModal, {
        centered:true,
        backdrop: 'static',
        size: 'lg'
    });
}

onDelete(){
    const deleteURL = 'http://localhost:8001/delstruct/' + this.deleteID;
    this.httpclient.delete(deleteURL).subscribe((results) => {
       // this.ngOnInit();
        this.refresh();
        this.modalService.dismissAll();
    });
}

}
