import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../products';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  products:Product[]=[];
  productForm:FormGroup;
  showAdd:boolean;
  showEdit:boolean;


  constructor(private productService:ProductService,private fb:FormBuilder){
    this.productForm = this.fb.group({
      id:['',Validators.required],
      name:['',Validators.required],
      price:[0,Validators.required],
      description:['']
    })
    this.showAdd = true;
    this.showEdit = false;
  }

  ngOnInit(){
    this.getProducts();
  }

  private getProducts():void{
    this.productService.getProducts().subscribe(res=>this.products = res);
  }

  
  add():void{

    const {name,price,description} = this.productForm.getRawValue();

    this.productForm.reset();
    
    this.productService.addNewProduct(name,price,description).subscribe(result=>{
      
      if(result){
        this.getProducts();
      }
    })

  }

  editProduct(index:number):void{
    this.showAdd = false;
    this.showEdit = true;

    this.productForm.patchValue({id:this.products[index].id});
    this.productForm.patchValue({name:this.products[index].name});
    this.productForm.patchValue({description:this.products[index].description});
    this.productForm.patchValue({price:this.products[index].price});

    console.log('id product: ',this.productForm.get('id')!.value);
    console.log('name: ',this.productForm.get('name')!.value);
  }

  modify():void{
    this.showEdit = false;
    this.showAdd = true;

    const {id,name,description,price} = this.productForm.getRawValue();
    this.productService.updateProduct(id,name,description,price).subscribe(res=>{
      if(res){
        this.productForm.reset();
        this.getProducts();
      }
    })
  }
  

  deleteProduct(index:number):void{
    this.productService.deleteProduct(this.products[index].id).subscribe(result=>{

      if(result){
        this.getProducts();
      }
    })
  }

}
