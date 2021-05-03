import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

export class User {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
//    public department: string,
    public email: string,
 //   public country: string
    public active: boolean
 ) {}
}

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {
users: User[];
closeResult: string;
editForm: FormGroup;
//stat: string;
 private deleteID: number;
  

  constructor(private httpclient: HttpClient,
    private modalService: NgbModal,
    private fb:FormBuilder,
   // private changeDetectorRefs:ChangeDetectorRef
     ) { }
 
  ngOnInit() {
    this.getUsers();
   // this.refresh();
    this.editForm = this.fb.group({
      id: [''],
      firstname: [''],
      lastname: [''],
      email: [''],
      active: ['']
    
    });
  
  }
/*
  refresh(){
this.changeDetectorRefs.detectChanges();
  }
*/

  getUsers(){
    this.httpclient.get<any>('http://localhost:8001/getusers').subscribe(response =>{
      console.log(response);
      this.users =response;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:8001/adduser';
    this.httpclient.post(url, f.value).subscribe((result) => {
        this.ngOnInit(); //reload the table
      });
    this.modalService.dismissAll(); //dismiss the modal
  }

  /*onDelete(){
    this.httpclient.delete('http:localhost:8001/:id').subscribe(()=> this.stat='delete successful');
  }*/
  openDetails(targetModal, user: User) {
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     size: 'lg'
   });
    document.getElementById('fname').setAttribute('value', user.firstname);
    document.getElementById('lname').setAttribute('value', user.lastname);
    document.getElementById('email2').setAttribute('value', user.email);
   // document.getElementById('status').setAttribute('value', user.active);
 }


 openEdit(targetModal, user: User) {
  this.modalService.open(targetModal, {
   centered: true,
   backdrop: 'static',
   size: 'lg'
 });
 this.editForm.patchValue({
   id: user.id,
   firstname: user.firstname,
   lastname: user.lastname,
   email: user.email,
   active: user.active
 });
}
 
onSave() {
  const editURL = 'http://localhost:8001/updateuser/' + this.editForm.value.id;
  console.log(this.editForm.value);
  this.httpclient.put(editURL, this.editForm.value)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}

openDelete(targetModal, user: User) {
  this.deleteID = user.id;
  this.modalService.open(targetModal, {
   centered: true,
   backdrop: 'static',
   size: 'lg'
 });
}

onDelete() {
  const deleteURL = 'http://localhost:8001/' + this.deleteID ;
  this.httpclient.delete(deleteURL)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}

}
