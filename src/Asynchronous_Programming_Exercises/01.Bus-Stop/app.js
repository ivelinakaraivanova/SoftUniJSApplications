async function getInfo() {
    const id = document.getElementById('stopId');
    const stopName = document.getElementById('stopName');
    const ulBuses = document.getElementById('buses');
    ulBuses.innerHTML = '';
    
    const url = 'http://localhost:3030/jsonstore/bus/businfo/' + id.value;

    try {
        const response = await fetch(url);
        const stop = await response.json();
        
        stopName.textContent = stop.name;
        
        for (const [busId, time] of Object.entries(stop.buses)) {
            const liBuses = document.createElement('li');
            liBuses.textContent = `Bus ${busId} arrives in ${time} minutes`;
            ulBuses.appendChild(liBuses);
        }

        id.value = '';

    } catch (error) {
        stopName.textContent = 'Error';
    }

}
