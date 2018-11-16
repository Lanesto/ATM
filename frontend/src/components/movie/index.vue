<template>
    <b-container fluid>
        <b-card-group>
            <movie-info v-bind="movie" v-for="movie in movies" :key="movie.MovieID"/>
        </b-card-group>
        <b-button block variant="outline-primary" @click="bringMovies" :Disabled="isEnd"
                        class="my-2">{{ btnText }}</b-button>
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
                this.bringMovies()
            }
        };
        this.bringMovies()
    },
    data() {
        return {
            movies: [],
            loadPoint: 0,
            btnText: 'Bring me more',
            isEnd: false
        }
    },
    methods: {
        bringMovies() {
            const loadCount = 8
            if (this.isEnd) return;
            this.$http.get('api/movie', {
                params: {
                    from: this.loadPoint,
                    to: this.loadPoint + loadCount - 1
                }
            }).then((res) => {
                let data = res.data
                if (data.length > 0) {
                    this.movies.push(...data)
                    this.loadPoint += data.length;
                } else {
                    this.isEnd = true;
                    this.btnText = 'We brought all the movies for you'
                }
            })
        }
    }
}
</script>
