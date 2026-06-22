import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productService/product-service';
import { CategoryService } from '../../services/categoryService/category-service';
import { AiService } from '../../services/aiService/ai-service';

@Component({
  selector: 'app-pc-builder',
  imports: [CommonModule, FormsModule],
  templateUrl: './pc-builder.html',
  styleUrl: './pc-builder.css',
})
export class PcBuilder implements OnInit {
  // Danh sách slots cấu hình PC
  componentSlots: {type: string, icon: string, categoryName: string, selected: any}[] = [
    { type: 'CPU', icon: '🧠', categoryName: 'CPU', selected: null },
    { type: 'Mainboard', icon: '🔲', categoryName: 'Mainboard', selected: null },
    { type: 'RAM', icon: '📊', categoryName: 'RAM', selected: null },
    { type: 'VGA', icon: '🎮', categoryName: 'VGA', selected: null },
    { type: 'SSD', icon: '💾', categoryName: 'SSD', selected: null },
    { type: 'PSU', icon: '⚡', categoryName: 'PSU', selected: null },
    { type: 'Case', icon: '🖥️', categoryName: 'Case', selected: null },
    { type: 'Tản nhiệt', icon: '❄️', categoryName: 'Tản nhiệt', selected: null },
  ];

  // Data
  allProducts: any[] = [];
  categories: any[] = [];
  modalProducts: any[] = [];
  modalSearchText: string = '';

  // Modal state
  showModal: boolean = false;
  currentSlotIndex: number = -1;

  // AI state
  aiPrompt: string = '';
  aiLoading: boolean = false;
  aiResult: any = null;
  aiError: string = '';
  showAiSection: boolean = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private aiService: AiService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getCategory().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.cd.detectChanges();
      }
    });

    this.productService.getAllProducts().subscribe({
      next: (prods) => {
        this.allProducts = prods.filter((p: any) => p.isActive && p.quantity > 0);
        this.cd.detectChanges();
      }
    });
  }

  // === MODAL: Chọn linh kiện ===
  openSelectModal(slotIndex: number) {
    this.currentSlotIndex = slotIndex;
    this.modalSearchText = '';
    const slot = this.componentSlots[slotIndex];

    // Tìm category phù hợp
    const cat = this.categories.find(
      (c: any) => c.name.toLowerCase() === slot.categoryName.toLowerCase()
    );

    if (cat) {
      this.modalProducts = this.allProducts.filter(
        (p: any) => p.categoryId === cat.categoryId
      );
    } else {
      this.modalProducts = [];
    }

    this.showModal = true;
    this.cd.detectChanges();
  }

  filterModalProducts() {
    const slot = this.componentSlots[this.currentSlotIndex];
    const cat = this.categories.find(
      (c: any) => c.name.toLowerCase() === slot.categoryName.toLowerCase()
    );

    let result = this.allProducts.filter(
      (p: any) => cat && p.categoryId === cat.categoryId
    );

    if (this.modalSearchText.trim()) {
      const q = this.modalSearchText.toLowerCase().trim();
      result = result.filter(
        (p: any) => p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
      );
    }

    this.modalProducts = result;
    this.cd.detectChanges();
  }

  selectProduct(product: any) {
    this.componentSlots[this.currentSlotIndex].selected = product;
    this.showModal = false;
    this.cd.detectChanges();
  }

  removeComponent(slotIndex: number) {
    this.componentSlots[slotIndex].selected = null;
    this.cd.detectChanges();
  }

  closeModal() {
    this.showModal = false;
  }

  // === Tính tổng ===
  getTotalPrice(): number {
    return this.componentSlots.reduce((total, slot) => {
      if (slot.selected) {
        const price = slot.selected.discountPrice || slot.selected.price;
        return total + price;
      }
      return total;
    }, 0);
  }

  getSelectedCount(): number {
    return this.componentSlots.filter(s => s.selected !== null).length;
  }

  // === Giỏ hàng ===
  addAllToCart() {
    const selectedItems = this.componentSlots.filter(s => s.selected !== null);
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 linh kiện!');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    for (const slot of selectedItems) {
      const product = slot.selected;
      const existingIndex = cart.findIndex((item: any) => item.productId === product.productId);
      if (existingIndex >= 0) {
        cart[existingIndex].qty += 1;
      } else {
        cart.push({
          productId: product.productId,
          name: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          imageUrl: product.imageUrl,
          brand: product.brand,
          qty: 1
        });
      }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm ${selectedItems.length} linh kiện vào giỏ hàng!`);
    this.router.navigate(['/user/cart']);
  }

  resetBuild() {
    this.componentSlots.forEach(s => s.selected = null);
    this.aiResult = null;
    this.aiPrompt = '';
    this.cd.detectChanges();
  }

  // === AI Gợi ý ===
  askAi() {
    if (!this.aiPrompt.trim()) {
      alert('Vui lòng nhập yêu cầu cấu hình!');
      return;
    }

    this.aiLoading = true;
    this.aiError = '';
    this.aiResult = null;
    this.cd.detectChanges();

    this.aiService.suggestBuild(this.aiPrompt).subscribe({
      next: (data) => {
        this.aiLoading = false;
        try {
          let resultText = data.result || '';
          console.log("Raw AI response:", resultText);

          // Trích xuất JSON nằm giữa dấu ngoặc nhọn đầu tiên và cuối cùng
          const firstBrace = resultText.indexOf('{');
          const lastBrace = resultText.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            resultText = resultText.substring(firstBrace, lastBrace + 1);
          }

          this.aiResult = JSON.parse(resultText);
          console.log("Parsed AI result object:", this.aiResult);
          this.applyAiSuggestion();
        } catch (e) {
          console.error("Lỗi khi parse JSON AI:", e);
          this.aiError = 'Không thể phân tích kết quả từ AI. Vui lòng thử lại.';
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error("Lỗi API AI:", err);
        this.aiLoading = false;
        this.aiError = err.error?.message || 'Lỗi kết nối đến AI. Vui lòng thử lại.';
        this.cd.detectChanges();
      }
    });
  }

  applyAiSuggestion() {
    if (!this.aiResult?.components) return;

    for (const comp of this.aiResult.components) {
      const product = this.allProducts.find((p: any) => p.productId === comp.productId);
      if (product) {
        const slotIndex = this.componentSlots.findIndex(
          s => s.type.toLowerCase() === comp.componentType.toLowerCase()
        );
        if (slotIndex >= 0) {
          this.componentSlots[slotIndex].selected = { ...product, aiReason: comp.reason };
        }
      }
    }
    this.cd.detectChanges();
  }

  getProductPrice(product: any): number {
    return product.discountPrice || product.price;
  }
}
