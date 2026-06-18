using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BE.Model
{
    public class ProductImage
    {
        [Key]
        public int ProductImageId { get; set; }
        public int ProductId { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsMain { get; set; } = false;

        public int DisplayOrder { get; set; } = 0;

        // Navigation
        [ForeignKey("ProductId")]
        public Product Product { get; set; }
    }
}
