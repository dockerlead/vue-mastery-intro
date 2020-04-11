var eventBus = new Vue()

Vue.component('product', {
    props: {
        premium : {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img v-bind:src="image" :alt="description" >
            </div>
            <div class="product-info">
                <h1>{{title}}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else="inStock" :class="{outOfStock: !inStock}">Out of Stock</p>
                <p>Sipping: {{shipping}}</p>

                <ul>
                    <li v-for="detail in details">{{detail}}</li>
                </ul>

                <div v-for="(variant, index) in variants" 
                    :key="variant.variantId" 
                    class="color-box" 
                    :style="{ backgroundColor: variant.variantColor }" 
                    @mouseover="updateProduct(index)">
                </div>

                <button v-on:click="addToCart" 
                :disabled="!inStock" 
                :class="{disabledButton : !inStock}">Add to Cart</button>

            </div>

            <product-tabs :reviews="reviews"></product-tabs>

        </div>`,
    data: function() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            selectedVariant: 0,
            description: 'Green-OnWhite Image',
            details: ["80% cotton", "20% Polyester", "Gender-netural"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []
        }
    },
    methods: {
        addToCart: function() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function(index) {
            this.selectedVariant = index
        }
    },
    computed: {
        title: function() {
            return this.brand + ' ' + this.product
        },
        image: function() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock: function() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping: function() {
            if (this.premium) {
                return 'Free'
            }
            return 2.99
        }
    },
    mounted: function() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }

})


Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <li v-for="error in errors">{{error}}</li>
            </p>
            <p>
                <label for="name">Name: </label>
                <input id="name" v-model="name">
            </p>
            <p>
                <label for="rating">Review: </label>
                <textarea id="review" v-model="review" ></textarea>
            </p>
            <p>
                <label for="rating">Rating: </label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data: function() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit: function() {
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            }
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab" 
                :class="{ activeTab: selectedTab === tab }" 
                @click="selectedTab = tab"
                v-for="(tab, index) in tabs" 
                :key="index" 
                >
                {{tab}}</span>

            <div v-show="selectedTab === 'Reviews'">
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>Rating: {{review.rating}}</p>
                        <p>{{review.review}}</p>
                    </li>
                </ul>
            </div>

            <product-review 
            v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    data: function() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})


var app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart: function (id) {
            this.cart.push(id)
        }
    }
})

