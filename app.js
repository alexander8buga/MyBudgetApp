//BUDGET CONTROLLER
var budgetController = (function() {
    // use capital letter sine it is function constructor
    var Expense = function(id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val) {
            var newItem;

            // create new id  
            if (data.allItems[type].lenght > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                
            }
            else {
                ID = 0;
            }
            // create new item based on 'inc' or 'exp' type
            if(type == 'exp') {
                newItem = new Expense(ID, des, val);
                
            } else if (type == 'inc') {
                newItem = new Income(ID, des, val);
                
            }
            // push item to data structure based on inc or exp
            data.allItems[type].push(newItem);

            // return the new item
            return newItem;
        },
        testing: function() {
            console.log(data);
        }
    }


})();


// UI CONTROLLER
var UIController = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.incomes__list',
        expenseContainer: '.expenses__list'

    }
    return {
        getInput: function(){
            // below we return an object with 3 properties
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };
        },
        addListItem: function(obj, type) {
            var html; 
            // Create html string with place holder text
            if (type === 'inc') {
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.incomeContainer;
            }
            else if (type === 'exp') {
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                element = DOMstrings.expenseContainer;
            }
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function() {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // convert list to array
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        getDOMstrings: function() {
            return  DOMstrings;
        }
    }
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) { 

    var setEventListeners = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13  || event.which === 13) {
                console.log('Enter was pressed!');
                ctrlAddItem();
            }
        });
    };

    var updateBudget = function() {
        // 1. Calculate the budget
        // 2. Return the budget
       // 3.  Display the budget on the UI
    };

    var ctrlAddItem = function() {
        var input, newItem;

         // 1. Get the field input filed data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            
            // 3. Add the item to the UI
            UIController.addListItem(newItem, input.type);
        
            // 4. Clear field
            UIController.clearFields();

            //5. Calculate and update budget
            updateBudget();
        }
    }

    // here we publicly initialize a function by returning an object
    return {
        init: function() {
            console.log("Application has  started");
            setEventListeners();
        }
    };


   
})(budgetController, UIController);

controller.init();




