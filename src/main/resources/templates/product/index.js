let index = 0; //biến chứa id khi edit

//hàm hiển thị form tạo mới product data
function displayFormCreate() {
    document.getElementById("form").reset()
    document.getElementById("form").style.display="block";
    document.getElementById("form").hidden = false;
    document.getElementById("form-button").onclick = function () {
        addNewProduct();
    }
    getCategory();
}

//hàm tạo mới product data
function addNewProduct() {
    document.getElementById("form").style.display="none";
    //lấy dữ liệu
    let name = $('#name').val();
    let dateTime = $('#dateTime').val();
    let category = $('#category').val();
    let newProduct = {
        name: name,
        dateTime: dateTime,
        category: {
            id: category
        }
    };

    // gọi ajax
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newProduct),
        //tên API
        url: "http://localhost:8080/products",
        //xử lý khi thành công
        success: function () {
            getProduct();
        }

    });
    //chặn sự kiện mặc định của thẻ
    event.preventDefault();
}

//hàm lấy list category
function getCategory() {
    $.ajax({
        type: "GET",
        //tên API
        url: `http://localhost:8080/products/category`,
        //xử lý khi thành công
        success: function (data) {
            let content = `<select id="category">`
            for (let i = 0; i < data.length; i++) {
                content += displayCategory(data[i]);
            }
            content += '</select>'
            document.getElementById('div-category').innerHTML = content;
        }
    });
}

//hàm hiển thị select list category
function displayCategory(category) {
    return `<option id="${category.id}" value="${category.id}">${category.name}</option>`;
}


//hàm hiển thị thông tin edit product
function editProduct(id) {
    document.getElementById("form").reset()
    document.getElementById("form").style.display="block";
    document.getElementById("form").hidden = false;
    $.ajax({
        type: "GET",
        //tên API
        url: `http://localhost:8080/api/products/${id}`,
        success: function (data) {
            $('#name').val(data.name);
            $('#dateTime').val(data.dateTime);
            index = data.id;
            document.getElementById("form").hidden = false;
            document.getElementById("form-button").onclick = function () {
                editProductPost()
            };
            getCategory();
        }
    });
}
function editProductPost() {
    let name = $('#name').val();
    let dateTime = $('#dateTime').val();
    let category = $('#category').val();
    let newProduct = {
        name: name,
        dateTime: dateTime,

        category: {
            id: category,
        }
    };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "PUT",
        data: JSON.stringify(newProduct),
        url: `http://localhost:8080/api/products/${index}`,
        success: function () {
            getProduct()
        }
    });
    event.preventDefault();
}

//hàm xóa 1 product data theo id
function deleteProduct(id) {
    $.ajax({
        type: "DELETE",
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            getProduct()
        }
    });
}

//hàm hiển thị table product data
function displayProduct(product) {
    return `<tr><td>${product.name}</td>
            <td>${product.dateTime}</td><td>${product.category.name}</td>
            <td><button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button></td>
            <td><button class="btn btn-warning" onclick="editProduct(${product.id})">Edit</button></td></tr>`;
}

function displayProductHeader() {
    return `<tr><th>ProductName</th>
            <th>DateTime</th>
            <th>Category</th>
            <th colspan="2">Action</th></tr>`
}

//hàm lấy list product
function getProduct() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/products`,
        success: function (data) {
            // hiển thị danh sách
            let content = displayProductHeader();
            for (let i = 0; i < data.length; i++) {
                content += displayProduct(data[i]);
            }
            document.getElementById("productList").innerHTML = content;
            // document.getElementById("form").hidden = true;
        }
    });
}

getProduct()
getCategory()