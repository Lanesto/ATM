<template>
    <b-container fluid>
        <b-card-group deck>
            <b-card class="mx-1 my-1 local-card" v-for="movie in movies" :key="movie.MovieID"
                    img-fluid img-top :img-src="movie.PosterIMG" :title="movie.MovieTitle"
                    :img-alt="movie.MovieTitle"
                    @click="showMovieInfo(movie.MovieID)">
                <b-badge class="local-badge" variant="info">{{ movie.Genre }}</b-badge>
            </b-card>
        </b-card-group>
        <b-button class="my-2" 
                  block variant="outline-primary" 
                  :Disabled="isEnd"
                  @click="bringMovies">{{ btnText }}</b-button>
        <movie-info :id="'movieInfo'" v-bind="this.movies[selectedMovie]"/>
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
            let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
            if (bottomOfWindow) {
                this.bringMovies()
            }
        }
        this.bringMovies()
    },
    data() {
        return {
            movies: [],
            selectedMovie: -1, // index movie in movies
            loadPoint: 1,
            loadCount: 8,
            isEnd: false,
            btnText: 'Bring some more'
        }
    },
    methods: {
        bringMovies() {
            if (this.isEnd) return
            this.$http.get('api/movie', {
                params: {
                    from: this.loadPoint,
                    to: this.loadPoint + this.loadCount - 1,
                    search: this.$route.query.searchOption || ''
                }
            }).then(({data}) => {
                if (data.length > 0) {
                    if (this.movies.length > 0) {
                        data.map((e1) => {
                            var pos = this.movies.findIndex((e2) => { 
                                return e2.MovieID === e1.MovieID 
                            })
                            if (pos === -1) {
                                this.movies.push(e1)
                                this.loadPoint++
                            }
                        })
                    } else {
                        this.movies.push(...data)
                        this.loadPoint += data.length
                    }
                }
                if (data.length < this.loadCount || data.length <= 0) {
                    this.isEnd = true
                    this.btnText = 'We brougth all the movies to you'
                }
            })
        },
        showMovieInfo(movieID) {
            this.selectedMovie = this.movies.findIndex((e) => {
                return e.MovieID === movieID
            })
            this.$root.$emit('bv::show::modal', 'movieInfo')
        }

    }
}
</script>

<style scoped>
/* Sizing reference: bootstrap-vue */
.local-badge {
    max-width: 100%;
    text-overflow: ellipsis;
}

@media screen and (max-width: 576px) { /* Extra Small */
    .local-card {
        width: 100%;
    }
}
@media screen and (min-width: 576px) { /* Small */
    .local-card {
        min-width: 40%;
        max-width: 50%;
    }
}
@media screen and (min-width: 768px) { /* Medium */
    .local-card {
        min-width: 30%;
        max-width: 33%;
    }
}
@media screen and (min-width: 992px) { /* Large and Extra Large */
    .local-card {
        min-width: 20%;
        max-width: 25%;
    }
}

</style>
