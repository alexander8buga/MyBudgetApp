//BUDGET CONTROLLER
var budgetController = (function(){
    //some code
})();


// UI CONTROLLER
var UIController = (function(){
    // some code
})();


// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function(){
        // 1. Get the field input filed data
       //2. Add the item to the budget controller
       // 3.  Add the item to the UI
       // 4. Calculate the budget
       // 5. Display the budget on the UI
       console.log("It works!");
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if (event.keyCode === 13  || event.which === 13) {
            console.log('Enter was pressed!');
            ctrlAddItem();
        }
    });
})(budgetController, UIController);




