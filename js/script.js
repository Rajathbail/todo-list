//var listNum = 0;
var openListPrefix = "list-",
    closedListPrefix = "completed-",
    inputPrefix = "inp-";

var todoList = [],
    closedTodoList = []

//Show placeholder if needed
showPlaceholderIfNeeded();

//Populate from db
for (var i = todoList.length - 1; i>=0; i--){
    addListItem("open-items", todoList[i].todoText, todoList[i]["id"])
}

for (var i = closedTodoList.length - 1; i>=0; i--){
    addListItem("closed-items", closedTodoList[i].todoText, closedTodoList[i]["id"])
}

//Add button handler
function addTodo(id){
    var ele = document.getElementById(id)
    //console.log("The text of the input element is " + ele.value);
    if (!ele.value) {
        return false;
    }
    addListItem("open-items", ele.value, Date.now());
    todoList.unshift({
        id: Date.now(),
        todoText: ele.value,
        completed: false
    })
    showPlaceholderIfNeeded();
    return false;
}

function addListItem(listName, todoText, id){
        var todoListUlNode = document.getElementById(listName);
        if (listName == "open-items") {
            var checked = "";
            var idText = openListPrefix;
        } else {
            var checked = "checked";
            var idText = closedListPrefix;
        }
        var segment =
            '<label class="custom-control custom-checkbox">' +
                '<input type="checkbox" class="custom-control-input" id="inp-'+ id +'" onchange=\'justChecked("' + listName + '", "' + id + '")\' ' + checked + '>' +
                '<span class="custom-control-indicator"></span>' +
                '<span class="custom-control-description">' + todoText +'</span>' +
            '</label>'+
        '<button type="button" class="close" style="float:none;" aria-label="Close" onclick = removeItem("' + listName + '","'+ id +'")>'+
            '<span aria-hidden="true">&times;</span>'+
        '</button>';

        var li = document.createElement("li");
        li.innerHTML = segment;
        li.setAttribute("class", "form-check");
        li.setAttribute("id", idText+id)

        if (todoListUlNode.firstChild) {
            todoListUlNode.insertBefore(li, todoListUlNode.firstChild);
        } else {
            todoListUlNode.appendChild(li);
        }
}

function removeItem(listName, id) {
    var todoListUlNode = document.getElementById(listName),
        el,
        idText,
        len,
        killList;

    if (listName == "open-items") {
        len = todoList.length;
        killList = todoList;
        idText = openListPrefix;
    } else {
        len = closedTodoList.length;
        killList = closedTodoList;
        idText = closedListPrefix;
    }

    el = document.getElementById(idText + id);
    todoListUlNode.removeChild(el);

    for (var i = 0; i<len; i++){
        if (killList[i].id == id) {
            killList.splice(i,1);
            break;
        }
    }
    showPlaceholderIfNeeded();
}

function justChecked(listName, id){

    var srcList = (listName == "open-items")? todoList : closedTodoList,
        dstList = (listName == "open-items")? closedTodoList : todoList;
    var idText = (listName == "open-items")? openListPrefix : closedListPrefix;

    var otherListName = (listName == "open-items")? "closed-items" : "open-items";

    for (var i = 0, len = srcList.length; i<len; i++){
        if((srcList[i].id) == id){
            dstList.unshift(srcList[i]);
            removeItem(listName, id);
            addListItem(otherListName, dstList[0].todoText, dstList[0]["id"]);
            if (srcList == todoList){
                dstList[0].completed = true;
            } else {
                dstList[0].completed = false;
            }
            break;
        }
    }
}

function hideUnhideCompleted(){
    var todoListCompletedNode = document.getElementById("closed-items"),
        flag = document.getElementById("show-checkbox").checked;

    if (flag) {
        todoListCompletedNode.classList.add("hide");
    } else {
        todoListCompletedNode.classList.remove("hide");
    }
}

function showPlaceholderIfNeeded(){
    var emptyText = document.getElementById("empty-placeholder"),
        hideBlock = document.getElementById("hide-block");

    if (todoList.length == 0 && closedTodoList.length == 0) {
        emptyText.classList.remove("hide");
        hideBlock.classList.add("hide");
    } else {
        emptyText.classList.add("hide");
        hideBlock.classList.remove("hide");
    }
}
