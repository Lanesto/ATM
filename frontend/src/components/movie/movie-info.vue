<template>
    <b-modal :id="this.id" ref="movieInfoModal" size="lg" hide-header hide-footer 
             @shown="reload">
        <b-container>
            <b-img class="mt-3" fluid thumbnail :src="this.PosterIMG"/>
            <h1 class="mx-2 mt-2 mb-3" style="display:inline-block">{{ MovieTitle }}</h1><b-badge variant="info">{{ Genre }}</b-badge>
            <p class="my-1"><strong>PlayTime:</strong> {{ PlayTime }}</p>
            <p class="my-1"><strong>Released Date:</strong> {{ ReleaseDate }}</p>
            <p class="my-1"><strong>Director:</strong> {{ Director }}</p>
            <p class="my-1"><strong>Actors:</strong> {{ Actors }}</p>
            <p class="mt-1 mb-2"><strong>Description:</strong></p>
            <pre class="mx-2 mt-1 mb-3">{{ Description }}</pre>
            <div>
                <p class="mb-1"><strong>Comments:</strong></p>
                <b-card-group class="my-3" columns>
                    <b-card class="mx-0" v-for="comment in comments" :key="comment.CommentID">
                        <strong class="mr-1">{{ comment.CustomerID }}</strong>
                        <small class="mr-2">{{ comment.PostDate }}</small>
                        <p class="text-warning">{{ starConvert(comment.Rate) }}</p>
                        <b-button class="float-right" 
                                size="sm" variant="light"
                                @click="deleteComment(comment.CommentID)">&times;</b-button>
                        <p class="ml-2 my-1" style="text-overflow:clip">{{ comment.Content }}</p>
                    </b-card>
                </b-card-group>
                <b-button class="mb-2" 
                        block :disabled="isEnd" variant="secondary"
                        @click="bringComments">See more comments</b-button>
                <b-form @submit.prevent="addComment">
                    <b-form-textarea id="textarea1" no-resize :rows="3" :max-rows="5"
                                     :readonly="!logonStatus" 
                                     :placeholder="logonStatus ? 'You can write maximum 200 characters' : 'Please login to make comment'"
                                     v-model="newComment.content"/>
                    <b-input-group class="mt-2" prepend="&bigstar;">
                        <b-form-select v-model="newComment.rate" :disabled="!logonStatus">
                            <option v-for="n in 6" :key="n" :value="2 * (n - 1)">{{ starConvert(2 * n - 2) }}</option>
                        </b-form-select>
                    </b-input-group>
                    <b-button class="mt-2 mb-3 float-right" type="submit" variant="primary"
                              :disabled="!isValidated">Comment</b-button>
                </b-form>
            </div>
        </b-container>
        <b-btn class="mt-3" block variant="outline-danger" @click="hideModal">Close</b-btn>
    </b-modal>
</template>

<script>
export default {
    props: [
        'id',
        // movie infos
        'MovieID',
        'MovieTitle',
        'ReleaseDate',
        'PlayTime',
        'Genre',
        'Director',
        'Actors',
        'Description',
        'PosterIMG'
    ],
    data() {
        return {
            prevID: -1,
            // Loading comments
            comments: [],
            loadPoint: 1,
            loadCount: 5,
            isEnd: false,
            // Form
            newComment: {
                rate: 0,
                content: ''
            }
        }
    },
    computed: {
        logonStatus: function() {
            return this.$store.getters.userInfo.logonStatus
        },
        isValidated: function() {
            return (this.newComment.content.length > 0) && (this.newComment.content.length <= 200)
        }
    },
    methods: {
        reload() {
            // this method is called every time user clicks an movie for detail information
            // and is becuz the modal is 'recycled', so the unnecessary informations shud be erased.
            this.comments = []
            this.loadPoint = 1
            this.isEnd = false
            this.newComment.rate = 0
            this.newComment.content = ''
            this.bringComments(this.loadCount)
        },
        hideModal() {
            this.$refs.movieInfoModal.hide()
        },
        starConvert(rate) {
            return '★'.repeat(rate / 2) + '☆'.repeat(5 - rate / 2)
        },
        bringComments(count) {
            if (this.isEnd) return
            this.$http.get('api/comment', {
                params: {
                    movieID: this.MovieID,
                    from: this.loadPoint,
                    to: this.loadPoint + count - 1,
                }
            }).then(({data}) => {
                if (data.length > 0) {
                    this.comments.push(...data)
                    this.loadPoint += data.length
                }
                if (data.length < count || data.length === 0) {
                    this.isEnd = true
                }
            })
        },
        reloadComments() {
            this.comments = []
            this.loadPoint = 1
            this.isEnd = false
            this.bringComments(this.loadCount * 2)
        },
        addComment() {
            this.$http.post('api/comment', {
                movieID: this.MovieID,
                rate: this.newComment.rate,
                content: this.newComment.content
            }).then((res) => { this.reloadComments() })
            .catch(err => {
                var msg = err.response.data.message || err.message
                alert(msg)
            })
        },
        deleteComment(commentID) {
            this.$http.delete(`api/comment/${commentID}`)
            .then((res) => { this.reloadComments() }).catch(err => {
                var msg = err.response.data.message || err.message
                alert(msg)
            })
        }
    }
}
</script>
