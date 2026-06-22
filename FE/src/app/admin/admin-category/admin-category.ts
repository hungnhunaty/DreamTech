import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CategoryService } from '../../services/categoryService/category-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-category',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-category.html',
  styleUrl: './admin-category.css',
})
export class AdminCategory {
  addCategoryForm!:FormGroup;
  updateCategoryForm!:FormGroup;

  showAddCategory: boolean = false;
  showUpdateCategory: boolean = false;

  listOfCategories!:any[];

  constructor(private categoryService:CategoryService, private fb:FormBuilder, private cd: ChangeDetectorRef){}
  ngOnInit(){
    this.loadCategories();

    this.addCategoryForm = this.fb.group({
      Name: ['', Validators.required],
      Description: ['', Validators.required]
    });

    this.updateCategoryForm = this.fb.group({
      CategoryId: ['', Validators.required],
      Name: ['', Validators.required],
      Description: ['', Validators.required]
    })
  }

  onSubmit(){
    if(this.addCategoryForm.invalid){
      this.addCategoryForm.markAllAsTouched();
      alert("Vui lòng nhập đầy đủ thông tin sản phẩm trước khi lưu!");
    }

    this.categoryService.addCategory(this.addCategoryForm.value).subscribe({
      next:(data) => {
        console.log(data);
        alert("Thêm danh mục thành công");
        this.loadCategories();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  loadCategories(){
    this.categoryService.getCategory().subscribe({
      next:(data) => {
        this.listOfCategories = data;
        console.log(data);
        this.cd.detectChanges();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }

  //open or close
  openCloseAddCategoryModal(){
    this.showAddCategory = !this.showAddCategory;
    console.log("value:" + this.showAddCategory);
  }

  openCloseUpdateCategoryModal(){
    this.showUpdateCategory = !this.showUpdateCategory;
    console.log("value:" + this.showUpdateCategory);
  }

  openUpdateCategoryModal(category: any) {
    this.showUpdateCategory = true;
    this.updateCategoryForm.patchValue({
      CategoryId: category.categoryId,
      Name: category.name,
      Description: category.description
    });
    this.cd.detectChanges();
  }

  deleteCategory(id:number){
    console.log("ID: " + id);
    if(confirm("Bạn chắc chắn muốn xóa danh mục này?")){
      this.categoryService.delCategory(id).subscribe({
        next:(data) => {
          alert("Xóa danh mục thành công");
          this.loadCategories();
        },
        error:(err) => {
          alert("Error: " + err.error.message);
        }
      })
    }
  }

  updateCategory(){
    if(this.updateCategoryForm.invalid){
      this.updateCategoryForm.markAllAsTouched();
      alert("Vui lòng nhập đầy đủ thông tin để cập nhật");
    }

    this.categoryService.updateCategory(this.updateCategoryForm.value).subscribe({
      next:(data) => {
        console.log(data);
        alert("Cập nhật danh mục thành công");
        this.loadCategories();
      },
      error:(err) => {
        alert("Error: " + err.error.message);
      }
    })
  }
}
