document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('queryForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const query = formData.get('query');

        fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({query: query})
        })
        .then(response => response.json())
        .then(data =>{
            if(data){
                window.location.href='process.html?place=' + encodeURIComponent(data.place) + '&zips=' + encodeURIComponent(data.zips.join(', '));
            } else{
                window.location.href = 'process.html?error=nodata';
            }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });


    });