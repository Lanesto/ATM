<template>
    <b-container fluid>
        <b-card-group deck>
            <movie-info v-bind="movie" v-for="movie in movies" :key="movie.MovieID"/>
        </b-card-group>
        <b-button class="my-2" 
                  block variant="outline-primary" 
                  :Disabled="isEnd"
                  @click="BringMovies">{{ btnText }}</b-button>
    </b-container>
</template>

<script>
import MovieInfo from './movie-info'

export default {
    components: {
        'movie-info': MovieInfo
    },
    created() {
        window.onscroll = () => {
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            if (bottomOfWindow) {
                this.BringMovies()
            }
        };
        this.BringMovies()
    },
    data() {
        return {
            movies: [],
            loadPoint: 1,
            loadCount: 8,
            btnText: 'Bring me more',
            isEnd: false
        }
    },
    methods: {
        BringMovies() {
            if (this.isEnd) return;
            this.$http.get('api/movie', {
                params: {
                    from: this.loadPoint,
                    to: this.loadPoint + this.loadCount - 1,
                    search: this.$route.query.searchOption || ''
                }
            }).then((res) => {
                let data = res.data
                if (data.length > 0) {
                    this.movies.push(...data)
                    this.loadPoint += data.length;
                }
                if (data.length < this.loadCount || data.length <= 0) {
                    this.isEnd = true;
                    this.btnText = 'We brougth all the movies for you';
                }
            })
        }
    }
}
</script>
