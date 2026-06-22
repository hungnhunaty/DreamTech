using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Dtos;

    public class UpdateProductDto
    {
        public int productId { get; set; }
        public int categoryId { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public decimal price { get; set; }
        public decimal? discountPrice { get; set; }
        public int quantity { get; set; }
        public string brand { get; set; }
        public IFormFile? Image { get; set; }
        public bool isActive { get; set; }
    }
