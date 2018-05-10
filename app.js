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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        calculateBudget: function() {
            // Calculate total income 
            calculateTotal('exp');
            calculateTotal('inc');
            // Calcutalte the budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
            } else {
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomesLabel: '.budget__incomes--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'

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

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget; 
            document.querySelector(DOMstrings.incomesLabel).textContent = obj.totalIncome; 
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;             
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage; 
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";                 
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = "---";
            }
            
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
        budgetController.calculateBudget();
        // 2. Return the budget
        var budget = budgetController.getBudget();
       // 3.  Display the budget on the UI
       UICtrl.displayBudget(budget);
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
            UIController.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExp: 0,
                percentage: -1
            });
            setEventListeners();
        }
    };


   
})(budgetController, UIController);

controller.init();




