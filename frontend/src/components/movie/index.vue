<template>
    <div class="movies">
        <movie-info v-for="movie in movies" :key="movie.movieID" v-bind="movie"/>
    </div>
</template>

<script>
import MovieInfo from './movie-info'

const loadCount = 4
var loadStart= 0 // search by MovieID
export default {
    name: 'movie',
    created() {
        window.onscroll = () => {
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
            if (bottomOfWindow) {
                this.bringMovies()
            }
        };
        this.bringMovies()
    },
    data: function() {
        return {
            movies: []
        }
    },
    methods: {
        bringMovies() {
            this.$http.get('api/movie', {
                params: {
                    from: loadStart,
                    to: loadStart + loadCount - 1
                }
            }).then((res) => {
                let data = res.data
                if (data.length > 0) {
                    this.movies.push(...data)
                    loadStart += data.length;
                }
            })
        }

    },
    components: {
        'movie-info': MovieInfo
    }
}
</script>

<style>

</style>