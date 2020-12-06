// Storage Controller
const StorageController = (function () {

    return{
        storeProduct: function(product){
            let products;
            if(localStorage.getItem("products")===null){
                products=[];
                products.push(product);
 
            }else{
                products = JSON.parse(localStorage.getItem("products"));
                products.push(product);
            }
                localStorage.setItem("products",JSON.stringify(products));
        },
        getProducts: function(){
            let products;
            if(localStorage.getItem("products")===null){
                products=[];
            }else{
                products = JSON.parse(localStorage.getItem("products"));
            }
            return products;
        },
        updateProduct: function(product){
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach(function(prd,index){
                if(product.id == prd.id){
                    products.splice(index,1,product)
                }
            });

            localStorage.setItem("products",JSON.stringify(products));
        },
        deleteProduct: function(id){
            let products = JSON.parse(localStorage.getItem("products"));

            products.forEach(function(prd,index){
                if(id == prd.id){
                    products.splice(index,1)
                }
            });

            localStorage.setItem("products",JSON.stringify(products));
        }
    }

})();



// Product Controller
const ProductController = (function () {

    //PRIVATE
    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price
    }

    const data = {
        products: StorageController.getProducts(),
        selectedProduct: null,
        totalPrice: 0,

    }

    //PUBLIC
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        setCurrentProduct: function(product){
            data.selectedProduct=product;
        },
        getCurrentProduct: function(){
            return data.selectedProduct;
        },
        getProductById: function(id){
            let product =null;

            data.products.forEach(function(prd){
                if(id==prd.id){
                    product=prd;
                }
            });

            return product;
        },
        addProduct: function (name, price) {
            let id;
            if (data.products.length > 0) {
                id = data.products.length + 1;
            } else {
                id = 1;
            }

            const newProduct = new Product(id, name, parseFloat(price));
            data.products.push(newProduct);

            return newProduct;
        },
        updateProduct: function(name,price){
            let product=null;

            data.products.forEach(function(prd){
                if(prd.id==data.selectedProduct.id){
                    prd.name=name;
                    prd.price=parseFloat(price);
                    product=prd;
                }
            });


            return product;
        },
        deleteProduct: function(product){
            data.products.forEach(function(prd,index){
                if(prd.id==product.id){
                    data.products.splice(index, 1);
                }
            });
        },
        getTotal: function () {
            let total = 0;

            data.products.forEach(function (item) {
                total += item.price;
            });

            data.totalPrice = total;
            return data.totalPrice;
        }
    }


})();



// UI Controller
const UIController = (function () {

    const Selectors = {
        productList: "#item-list",
        productListItems: "#item-list tr",
        addButton: ".addBtn",
        updateButton: ".updateBtn",
        cancelButton: ".cancelBtn",
        deleteButton: ".deleteBtn",
        productName: "#productName",
        productPrice: "#productPrice",
        prouctCard: "#productCard",
        totalTL: "#total-tl",
        totalDolar: "#total-dolar",
    }

    return {
        createProductList: function (products) {
            let html = ``;


            products.forEach(prd => {
                html += `
            <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-right">
                    <i class="far fa-edit edit-product"></i>
                </td>
            </tr>
            `;
            });
            document.querySelector(Selectors.productList).innerHTML = html;
        },
        getSelectors: function () {
            return Selectors;
        },
        addProduct: function (prd) {

            document.querySelector(Selectors.prouctCard).style.display = "block";

            let html = `
        <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price} $</td>
            <td class="text-right">
                <i class="far fa-edit edit-product"></i>
            </td>
        </tr>
        `;

            document.querySelector(Selectors.productList).innerHTML += html;

        },
        updateProduct: function(prd){
            let updatedItem = null;

            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains("bg-warning")){
                    item.children[1].textContent=prd.name;
                    item.children[2].textContent=prd.price +" $";
                    updatedItem = item;
                }
            })

            return updatedItem;
        },
        clearInputs: function () {
            document.querySelector(Selectors.productName).value = "";
            document.querySelector(Selectors.productPrice).value = "";
        },
        clearWarnings: function(){
            const items=document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains("bg-warning")){
                    item.classList.remove("bg-warning");
                }
            });
        },
        hideCard: function () {
            document.querySelector(Selectors.prouctCard).style.display = "none";
        },
        showTotal: function (total) {
            document.querySelector(Selectors.totalDolar).textContent = total;
            document.querySelector(Selectors.totalTL).textContent = total * 8;
        },
        addProductToForm: function(){
            const selectedProduct = ProductController.getCurrentProduct();
            document.querySelector(Selectors.productName).value = selectedProduct.name;
            document.querySelector(Selectors.productPrice).value = selectedProduct.price ;
        },
        deleteProduct: function(){
            let items = document.querySelectorAll(Selectors.productListItems);
            items.forEach(function(item){
                if(item.classList.contains("bg-warning")){
                    item.remove();
                }
            });
        },
        addingState: function(item){

            UIController.clearWarnings();
            UIController.clearInputs();
            document.querySelector(Selectors.addButton).style.display="inline";
            document.querySelector(Selectors.updateButton).style.display="none";
            document.querySelector(Selectors.cancelButton).style.display="none";
            document.querySelector(Selectors.deleteButton).style.display="none";
        },
        editState: function(tr){

            tr.classList.add("bg-warning");

            document.querySelector(Selectors.addButton).style.display="none";
            document.querySelector(Selectors.updateButton).style.display="inline";
            document.querySelector(Selectors.cancelButton).style.display="inline";
            document.querySelector(Selectors.deleteButton).style.display="inline";
        }

    }

})();




// App Controller
const App = (function (PorductCtrl, UICtrl, StorageCtrl) {

    const UISelectors = UICtrl.getSelectors();

    const loadEventListeners = function () {

        //Add Product Event
        document.querySelector(UISelectors.addButton).addEventListener("click", productAddSubmit);
        //Edit Product Click
        document.querySelector(UISelectors.productList).addEventListener("click", productEditClick);
        //edit product submit
        document.querySelector(UISelectors.updateButton).addEventListener("click",editProductSubmit);
        //cancel button clicked
        document.querySelector(UISelectors.cancelButton).addEventListener("click",cancelUpload);
        //delete button submit
        document.querySelector(UISelectors.deleteButton).addEventListener("click",deleteProductSubmit)
    }

    const productAddSubmit = function (e) {

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if (productName !== "" && productPrice !== "") {
            //Add Product
            const newProduct = PorductCtrl.addProduct(productName, productPrice);

            //Add item to list
            UICtrl.addProduct(newProduct);

            //Add product to local storage
            StorageCtrl.storeProduct(newProduct);

            //get Total Money
            const total = PorductCtrl.getTotal();

            //Show total to list
            UICtrl.showTotal(total);

            //clear Inputs
            UICtrl.clearInputs();
        }


        e.preventDefault();
    }

    const productEditClick = function (e) {
        
        if(e.target.classList.contains("edit-product")){
           const id = e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

            //get Selected Product
        const product = PorductCtrl.getProductById(id);

            //Set Current Product
            PorductCtrl.setCurrentProduct(product);

            UICtrl.clearWarnings();

            //add Product to Form
            UICtrl.addProductToForm();

            //show Edit Buttons
            UICtrl.editState(e.target.parentNode.parentNode);

        }
       

        e.preventDefault();
    }

    const editProductSubmit = function(e){

        const productName = document.querySelector(UISelectors.productName).value;
        const productPrice = document.querySelector(UISelectors.productPrice).value;

        if(productName!=="" && productPrice!==""){
            //update Product
            const updatedProduct = PorductCtrl.updateProduct(productName,productPrice);
            //update UI
            const item = UICtrl.updateProduct(updatedProduct);

            //get Total Money
            const total = PorductCtrl.getTotal();

            //Show total to list
            UICtrl.showTotal(total);

            //Update storage
            StorageController.updateProduct(updatedProduct);

            UICtrl.addingState();

        }
        
        

        e.preventDefault();
    }

    const cancelUpload = function(e){

        UICtrl.addingState();
        UICtrl.clearWarnings();

        e.preventDefault();
    }

    const deleteProductSubmit = function(e){

        const selectedProduct = ProductController.getCurrentProduct();
        //delete product
        PorductCtrl.deleteProduct(selectedProduct);
        //delet from uı
        UICtrl.deleteProduct();

        //get Total Money
        const total = PorductCtrl.getTotal();

        //Show total to list
        UICtrl.showTotal(total);

        //delete from storage
        StorageController.deleteProduct(selectedProduct.id);

        //clear Inputs
        UICtrl.addingState();

        if(total==0){
            UICtrl.hideCard();
        }

        e.preventDefault();
    }


    return {
        init: function () {
            console.log("Starting App");

            UICtrl.addingState();
            const products = PorductCtrl.getProducts();

            if (products.length == 0) {
                UICtrl.hideCard();
            } else {
                UICtrl.createProductList(products);
            }
            //get Total Money
            const total = PorductCtrl.getTotal();

            //Show total to list
            UICtrl.showTotal(total);


            //load Event Listeners
            loadEventListeners();
        }
    }


})(ProductController, UIController, StorageController);


App.init();
