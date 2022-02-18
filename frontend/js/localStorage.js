export function getMyStorage(nameStor) { 
  let storage = localStorage.getItem(nameStor)
  let myStorage = JSON.parse(storage)

  return myStorage
}

export function addElemInMyStorage(localStor, {name, done, id}) {
  let myStorage = getMyStorage(localStor)

  let storage = myStorage 
                ? myStorage.concat([{name, done, id}]) 
                : [{name, done, id}]

  localStorage.setItem(`${localStor}`, JSON.stringify(storage))
}

export function doneItemStorage(myStorage, localStorName, listElement) { 
  myStorage = getMyStorage(localStorName)
  let index = myStorage.findIndex(el => el.id === listElement)
  myStorage[index].done = !myStorage[index].done
  localStorage.setItem(`${localStorName}`, JSON.stringify(myStorage))
}

export function removeItemFromStorage(myStorage, localStorName, listElement) { 
    myStorage = getMyStorage(localStorName)
    let newStore = myStorage.filter(el => el.id !== listElement)
    localStorage.setItem(`${localStorName}`, JSON.stringify(newStore))
}

export function getStore() {
  let storage = localStorage.getItem('store')
  let myStorage = JSON.parse(storage)

  return myStorage
}

export function changeStore(data) {
  localStorage.setItem(`store`, JSON.stringify(data))
}