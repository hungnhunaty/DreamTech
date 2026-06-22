import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/productService/product-service';
import { CategoryService } from '../../services/categoryService/category-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-product',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './admin-product.html',
  styleUrl: './admin-product.css',
})
export class AdminProduct {
  addProductForm!:FormGroup;
  updateProductForm!:FormGroup;

  showAddProduct: boolean = false;
  showUpdateProduct: boolean = false;

  productList: any[] = [];
  categoryList: any[] = [];
  filteredProducts: any[] = [];

  // Filter properties
  searchText: string = '';
  selectedCategoryId: string = '';

  constructor(
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private fb:FormBuilder,
    private cd: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.loadProducts();
    this.loadCategories();

    this.addProductForm = this.fb.group({
      CategoryId: ['', Validators.required],
      Name: ['', Validators.required],
      Description: [''],
      Price: ['', Validators.required],
      Quantity: ['', Validators.required],
      Brand: [''],
      ImageUrl: ['']
    });

    this.updateProductForm = this.fb.group({
      ProductId: ['', Validators.required],
      CategoryId: ['', Validators.required],
      Name: ['', Validators.required],
      Description: [''],
      Price: ['', Validators.required],
      DiscountPrice: [''],
      Quantity: ['', Validators.required],
      Brand: [''],
      ImageUrl: [''],
      IsActive: [true]
    });
  }

  selectedFile: File | null = null;

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(){
    if(this.addProductForm.invalid){
      this.addProductForm.markAllAsTouched();
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm trước khi lưu!");
      return;
    }

    const formData = new FormData();
    Object.keys(this.addProductForm.value).forEach(key => {
      formData.append(key, this.addProductForm.value[key]);
    });
    
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    this._productService.addProduct(formData).subscribe({
      next:(data) => {
        console.log(data);
        alert("Thêm sản phẩm thành công");
        this.loadProducts();
        this.showAddProduct = false;
        this.selectedFile = null;
        this.addProductForm.reset();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  loadProducts(){
    this._productService.getAllProducts().subscribe({
      next:(data) => {
        this.productList = data;
        this.applyFilters();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  loadCategories(){
    this._categoryService.getCategory().subscribe({
      next:(data) => {
        this.categoryList = data;
      },
      error:(err) => {
        console.log("Error loading categories: " + err.error.message);
      }
    })
  }

  applyFilters() {
    let result = this.productList;

    if (this.selectedCategoryId) {
      const catId = Number(this.selectedCategoryId);
      result = result.filter(p => p.categoryId === catId);
    }

    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand?.toLowerCase().includes(q)
      );
    }

    this.filteredProducts = result;
    this.cd.detectChanges();
  }

  //open or close
  openCloseAddProductModal(){
    this.showAddProduct = !this.showAddProduct;
  }

  openCloseUpdateProductModal(){
    this.showUpdateProduct = !this.showUpdateProduct;
  }

  openUpdateProductModal(product: any) {
    this.showUpdateProduct = true;
    this.updateProductForm.patchValue({
      ProductId: product.productId,
      CategoryId: product.categoryId,
      Name: product.name,
      Description: product.description,
      Price: product.price,
      DiscountPrice: product.discountPrice || 0,
      Quantity: product.quantity,
      Brand: product.brand,
      ImageUrl: product.imageUrl,
      IsActive: product.isActive
    });
    this.cd.detectChanges();
  }

  deleteProduct(id:number){
    if(confirm("Bạn chắc chắn muốn xóa sản phẩm này?")){
      this._productService.delProduct(id).subscribe({
        next:(data) => {
          alert("Xóa sản phẩm thành công");
          this.loadProducts();
        },
        error:(err) => {
          alert("Error: " + err.error.message);
        }
      })
    }
  }

  updateProduct(){
    if(this.updateProductForm.invalid){
      this.updateProductForm.markAllAsTouched();
      alert("Vui lòng nhập đầy đủ thông tin để cập nhật");
      return;
    }

    const formData = new FormData();
    Object.keys(this.updateProductForm.value).forEach(key => {
        const value = this.updateProductForm.value[key];
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    this._productService.updateProduct(formData).subscribe({
      next:(data) => {
        console.log(data);
        alert("Cập nhật sản phẩm thành công");
        this.loadProducts();
        this.showUpdateProduct = false;
        this.selectedFile = null;
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }
}
