let todos = []; //리스트
const writeArea = document.getElementById("writeArea"); //입력창
const listAdd = document.getElementById("listAdd"); //추가 버튼
const listDel = document.getElementById("listDel"); //삭제 버튼
const selectAll = document.getElementById("selectAll"); //전체 선택
const listArea = document.getElementById("listArea"); //리스트 영역

async function get (url) {
  const json = await fetch(url).then(res => res.json())
  if (!json.success) throw json.err
  return json.data
}

async function set (url, data, method = 'post') {
  const headers = { 'Content-Type': 'application/json' }
  const params = { method, headers, body: JSON.stringify(data) }
  const json = await fetch(url, params).then(res => res.json())
  if (!json.success) throw json.err
  return json.data
}

async function getFolder () {
    try {
        todos = await get('/api/task');
        await listSet();
    } catch (error) {
        console.log(error);
    }
}

async function setFolder (task) {
  await set('/api/task/', task);
}

getFolder ();


//추가 이벤트
listAdd.addEventListener("click", function () {
    const value = writeArea.value;
    writeArea.value = "";
    if (value !== "" && value) {
        todos = [...todos, { listNum: null, checked: "", text: value, data: dataVal() }];
        listSet();
    }
});

//삭제 이벤트
listDel.addEventListener("click", function () {
    const delTodos = todos.filter(todo => todo.checked === "");
    todos = delTodos;
    listSet();
});

//전체 선택 이벤트
selectAll.addEventListener("click", function () {
    if (this.innerText === "전체 선택" && todos[0]) {
        this.innerHTML = "선택 해제"
        const checkTodo = todos.map((todo) => {
            todo.checked = "checked";
            return todo;
        });
    } else if (this.innerText === "선택 해제") {
        this.innerHTML = "전체 선택"
        const checkTodo = todos.map((todo) => {
            todo.checked = "";
            return todo;
        });
    }
    listSet();
});

//리스트 출력
async function listSet() {
  let listWrap = `<ul>`;
  todos.map((todo, idx) => {
      todo.listNum = idx;
      listWrap +=
          `<li check-id=${idx}>
              <input type='checkbox' ${todo.checked} onclick='checkBtn.call(this)'>
              <span>${todo.text}</span>
              <span class='data'>${todo.data}</span>
              <button class='delBtn' onclick='closeBtn.call(this)'>X</button>
          </li>`;
      return listWrap;
  });
  listWrap += `</ul>`;
  listArea.innerHTML = listWrap;
  console.log(todos);
  try{
    await setFolder({"task": todos});
  } catch(error) {
    console.log(error);
  }
}

//체크박스 이벤트
function checkBtn() {
    const checkNum = parseInt(this.parentNode.getAttribute("check-id"));
    const checkTodo = todos.map((todo, idx) => {
        if (checkNum === idx) {
            todo.checked = "checked";
        }
        return todo;
    });
    todos = checkTodo;
}

//닫기 이벤트
function closeBtn() {
    const checkNum = parseInt(this.parentNode.getAttribute("check-id"));
    const checkTodo = todos.filter((todo, idx) => idx !== checkNum);
    todos = checkTodo;
    listSet();
}

//시간
function dataVal() {
    const data = new Date();
    const year = data.getFullYear(); // 년도
    const month = data.getMonth() + 1;  // 월
    const date = data.getDate();  // 날짜
    const day = data.getDay();  // 요일
    const dataPrint = `${year}/${month}/${date}`;
    return dataPrint;
}

  