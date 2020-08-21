const state = {
    jobs: [],
};
const createJobCard = (job) => {
    const {
        type,
        url,
        created_at,
        company,
        company_url,
        location,
        title,
        description,
        how_to_apply,
        company_logo
    } = job;
    const jobCard = $(`<div class='job-card'>
                        <h3>${ title }</h3>
                        <p>Full or part-time?: ${ type }</p>
                        <p>Company: ${ company }</p>
                        <p>Where: ${ location }</p>
                        <p>Job Description: ${ description }</p>
                        <p>Job Posted On: ${ created_at }</p>
                        <p><a href="${ url }" target="_blank">Job Link</a></p>
                        <p><a href="${ company_url }" target="_blank">Company Site</a></p>
                        <p>${ how_to_apply }</p>
                        <img src="${ company_logo }               
                    `);
    const styles = {
        
    }

                
    return jobCard;
};
const renderJobCards = () => {
    const { jobs } = state;
    const jobCards = jobs.map(createJobCard);
    $('#results').empty();
    $('#results').append(jobCards);
};
$('#job-search').on('submit', async (event) => {
    event.preventDefault();
    console.log('CLICKED');
    const [ description, fulltime ] = [ $('#description').val(), $('#fulltime').val() ];
    const response = await fetch(`/job-search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description,
            fulltime
        }),
    });
    const data = await response.json();
    console.log(data);
    const jobs = data.results;
    state.jobs = jobs; 
    console.log(state.jobs);
    renderJobCards();
});

async function fetchQuote() {
    const response = await fetch('/cowspiration');
    const { cow } = await response.json();
  
    $('#results').empty().append($(`<pre>${ cow }</pre>`))
  }
  
  fetchQuote();

async function fetchWeather() {
    if (!navigator || !navigator.geolocation) {
      $('#weather').append($('<h3>Weather not available on this browser</h3>'))
    }
  
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { coords: { latitude, longitude } } = position;
  
      const response = await fetch(`/weather?lat=${ latitude }&lon=${ longitude }`);
      const { results } = await response.json();
  
      if (results.daily) {
        $('#weather').empty();
  
        results.daily.forEach(day => {
          const { weather: [{ icon }] } = day;
  
          $('#weather').append($(`
            <img src="http://openweathermap.org/img/wn/${ icon }@2x.png" />
          `));
        });
      }
    }, async (error) => {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      if (result.state == "denied") {
        $('#weather').html(
          $(`<div>
              <h3>You have denied access to location services.</h3>
              <h4>If you wish to see your forecast, update your settings and refresh.</h4>
            </div>`)
        )
      }
    });
  }
  
  fetchWeather();