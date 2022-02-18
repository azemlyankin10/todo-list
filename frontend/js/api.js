export async function getMyApi(owner) {
  const response = await fetch(`http://localhost:3000/api/todos?owner=${owner}`)
                   .then(res => res.json())

  return response
}

export async function addInMyApi(data) { 
  await fetch('http://localhost:3000/api/todos', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export async function deleteElemInMyApi(id) {
  await fetch(`http://localhost:3000/api/todos/${id}`, {
    method: 'DELETE',
  })
}

export async function doneItemInMyApi(id, body) {
  await fetch(`http://localhost:3000/api/todos/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'PATCH',                                                              
    body: JSON.stringify(body)                                        
  })
}