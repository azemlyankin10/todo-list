import { getStore, changeStore } from './localStorage.js'
let storage = getStore()

let store = null
if(storage) {
  store = await import('./localStorage.js');
} else {
  store = await import('./api.js');
}

function createAppTitle(appTitle) {  //Создаем заголовок
  let title = document.createElement('h2')
  title.innerHTML = appTitle
  return title
}

function createTodoForm() {   //Создаем форму
  let form = document.createElement('form')
  let input = document.createElement('input')
  let buttonWrapp = document.createElement('div')
  let btn = document.createElement('button')

  form.classList.add('input-group', 'mb-3')
  input.classList.add('form-control')
  input.placeholder = 'Введите название нового дела'
  buttonWrapp.classList.add('input-group-append')
  btn.classList.add('btn', 'btn-primary')
  btn.textContent = 'Добавить'
  btn.setAttribute('disabled', '')

  buttonWrapp.append(btn)
  form.append(input)
  form.append(buttonWrapp)

  return {
    form,
    input,
    btn
  }
}

function createTodoItem(name = '', done = false, index) {   //Создаем элемент списка
  let item = document.createElement('li')
  item.setAttribute('id', index)
  let buttonGroup = document.createElement('div')
  let doneButton = document.createElement('button')
  let deleteButton = document.createElement('button')

  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
  item.textContent = name
  if(done) {
    item.classList.add('list-group-item-success')
  }

  buttonGroup.classList.add('btn-group', 'btn-group-sm')
  doneButton.classList.add('btn', 'btn-success')
  doneButton.textContent = 'Готово'
  deleteButton.classList.add('btn', 'btn-danger')
  deleteButton.textContent = 'Удалить'

  buttonGroup.append(doneButton)
  buttonGroup.append(deleteButton)
  item.append(buttonGroup)

  return {
    item,
    doneButton,
    deleteButton
  }
}

async function createTodoList(container, form, localStor) {  //Создаем список
  let myStorage = storage ? store.getMyStorage(localStor) : await store.getMyApi(localStor)

  const list = document.createElement('ul')
  list.classList.add('list-group')
  container.append(list)

  if(myStorage) {  // Добавляем элементы списка на страницу при запуске приложения
    myStorage.forEach((item) => {
      let todoItem = createTodoItem(item.name, item.done, item.id)
      list.append(todoItem.item)
      todoItem.doneButton.addEventListener('click', async (e) => {
        let listElement = +e.target.parentNode.parentNode.id
        if(storage) {
          store.doneItemStorage(myStorage, localStor, listElement)
          todoItem.item.classList.toggle('list-group-item-success')
        } else {
          await store.doneItemInMyApi(listElement, {
            name: item.name,
            done: !item.done,
            id: item.id
          })
          document.querySelector('.list-group').remove()
          createTodoList(container, form, localStor)
        }
      })
      todoItem.deleteButton.addEventListener('click', async (e) => {
        let listElement = +e.target.parentNode.parentNode.id
        if(storage) {
          if(confirm('Вы уверены?')) {
            store.removeItemFromStorage(myStorage, localStor, listElement)
            todoItem.item.remove()
          }
        } else {
          if(confirm('Вы уверены?')) {
            await store.deleteElemInMyApi(listElement)
            document.querySelector('.list-group').remove()
            createTodoList(container, form, localStor)
          }
        }
      })
    })
  }

  form.input.addEventListener('input', () => {
    if(form.input.value) {
      form.btn.removeAttribute('disabled')
    } else {
      form.btn.setAttribute('disabled', '')
    }
  })
  
  form.form.addEventListener('submit', e => {
    e.preventDefault()
    form.btn.setAttribute('disabled', '')

    if(!form.input.value) {
      return
    }

    if(storage) {
      const id = Date.now()
      store.addElemInMyStorage(localStor, {
        name: form.input.value,
        done: false,
        id
      })

      //Создаем новый элемент на странице
      let todoItem = createTodoItem(form.input.value, false, id)
      todoItem.doneButton.addEventListener('click', (e) => {
        let listElement = +e.target.parentNode.parentNode.id
        doneItemStorage(myStorage, localStor, listElement)
        todoItem.item.classList.toggle('list-group-item-success')
      })
      todoItem.deleteButton.addEventListener('click', (e) => {
        let listElement = +e.target.parentNode.parentNode.id
        removeItemFromStorage(myStorage, localStor, listElement)
        todoItem.item.remove()
      })

      list.append(todoItem.item)
    } else {
      store.addInMyApi({
        name: form.input.value,
        owner: localStor,
        done: false
      })
      document.querySelector('.list-group').remove()
      createTodoList(container, form, localStor)
    }
    form.input.value = ''
  })


}

function createTodoApp(container, title = 'Список дел', localStor) {
  let todoAppTitle = createAppTitle(title)
  let todoItemForm = createTodoForm()
  let changeStoreBtn = document.createElement('button')
  changeStoreBtn.classList.add('btn', 'btn-danger', 'ml-auto')
  changeStoreBtn.textContent = storage ? 'Перейти на серверное хранилище' : 'Перейти на локальное хранилище'
  changeStoreBtn.addEventListener('click', () => {
    changeStore(!storage)
    location.reload()
  })
  container.append(todoAppTitle)
  container.append(todoItemForm.form)
  document.querySelector('.nav').append(changeStoreBtn)

  createTodoList(container, todoItemForm, localStor)
}

export default createTodoApp