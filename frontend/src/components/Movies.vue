<template>
    <div class="movies">
        <h1>Movie List</h1>
        <div v-for="movie in movies" class="movie">
            <img v-bind:src="movie.PosterIMG" width="300" height="420" class="poster">
            <div>
                <strong> {{ movie.MovieTitle }} </strong>
                <router-link :to="{ name: 'movie-info', params: { id: movie.MovieID } }">More</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        created: function() {
            this.$http.get('api/movies').
            then((res) => {
                this.movies = res.data
            })
        },
        data: function() {
            return {
                movies: []
            }
        }
    }
</script>

<style>
    .movie {
        display: 'inline-block';
        float: left;
    }
</style>