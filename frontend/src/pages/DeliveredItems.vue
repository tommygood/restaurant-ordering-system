<template>
  <div class="delivered-items-section">
    <div class="container">
      <h1 class="text-center mb-5">Delivered Orders</h1>
      
      <div class="row">
        <div class="col-12">
          <div v-if="deliveredItems.length === 0" class="text-center">
            <h3>No delivered items found</h3>
          </div>
          
          <div v-else class="delivered-items">
            <div v-for="item in deliveredItems" :key="item.cart_id" class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <!-- Food Image -->
                  <div class="col-md-3">
                    <img 
                      :src="`/api/download/order_${item.food_id}_${item.user_id}_${item.table_id}.png`" 
                      :alt="item.food_name"
                      class="img-fluid rounded"
                    />
                  </div>
                  
                  <!-- Order Details -->
                  <div class="col-md-6">
                    <h4 class="card-title text-success">{{ item.food_name }}</h4>
                    <p class="card-text">
                      <strong>Customer:</strong> {{ item.user_name }}<br>
                      <strong>Quantity:</strong> {{ item.item_qty }}<br>
                      <strong>Price:</strong> ${{ calculatePrice(item) }}<br>
                      <strong>Table:</strong> {{ item.table_id }}
                    </p>
                  </div>
                  
                  <!-- Feedback Section -->
                  <div class="col-md-3">
                    <div class="feedback-section">
                      <h5>Customer Feedback</h5>
                      <div class="stars">
                        <span v-for="n in 5" :key="n" class="star">
                          <i :class="['fas', 'fa-star', { 'text-warning': n <= item.grade }]"></i>
                        </span>
                      </div>
                      <p class="feedback-text mt-2">
                        {{ item.feedback || 'No feedback provided' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DeliveredItems',
  
  data() {
    return {
      deliveredItems: []
    };
  },
  
  mounted() {
    this.fetchDeliveredItems();
  },
  
  methods: {
    async fetchDeliveredItems() {
      try {
        const response = await axios.get('/delivered-items');
        if (response.data.status) {
          this.deliveredItems = response.data.data;
        }
      } catch (error) {
        console.error('Failed to fetch delivered items:', error);
      }
    },
    
    calculatePrice(item) {
      const basePrice = parseFloat(item.food_price);
      const discount = parseFloat(item.food_discount);
      const quantity = parseInt(item.item_qty);
      return ((basePrice - discount) * quantity).toFixed(2);
    },
  }
};
</script>

<style scoped>
.delivered-items-section {
  padding: 2rem 0;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.stars {
  color: #ddd;
}

.star {
  margin-right: 2px;
}

.text-warning {
  color: #ffc107 !important;
}

.feedback-text {
  font-size: 0.9rem;
  font-style: italic;
  color: #666;
}

img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style> 