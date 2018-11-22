<template>
    <div>
        <b-card class="mx-1 my-1" style="max-width:14rem;"
                img-top 
                img-alt="Image"
                img-fluid
                :img-src="this.PosterIMG"
                :title="this.MovieTitle"
                @click="showModal">
            <b-badge variant="info">{{ Genre }}</b-badge>
        </b-card>
        <b-modal ref="modalRef" 
                 size="lg" lazy hide-header hide-footer>
            <b-container>
                <b-img class="mt-3" 
                        fluid thumbnail :src="this.PosterIMG"/>
                <h1 class="mx-2 mt-2 mb-3" style="display:inline-block;">{{ MovieTitle }}</h1><b-badge variant="info">{{ Genre }}</b-badge>
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
                            <p class="text-warning">{{ '★'.repeat(comment.Rate / 2) + '☆'.repeat(5 - comment.Rate / 2) }}</p>
                            <b-button class="float-right" 
                                    size="sm" variant="light"
                                    @click="DeleteComment(comment.CommentID)">&times;</b-button>
                            <p class="ml-2 my-1" style="text-overflow:clip;">{{ comment.Content }}</p>
                        </b-card>
                    </b-card-group>
                    <b-button class="mb-2" 
                            block :disabled="isEnd" variant="secondary"
                            @click="BringComments">See more comments</b-button>
                    <b-form @submit="AddComment">
                        <b-form-textarea id="textarea1"
                                            no-resize :rows="3" :max-rows="5"
                                            v-model="commentContent"/>
                        <b-input-group class="mt-2" prepend="&bigstar;">
                            <b-form-select v-model="commentRate">
                                <option v-for="n in 6" :key="n" :value="2 * (n - 1)">{{ '★'.repeat(n - 1) + '☆'.repeat(6 - n)}}</option>
                            </b-form-select>
                        </b-input-group>
                        <b-button class="mt-2 mb-3 float-right" type="submit" variant="primary">Comment</b-button>
                    </b-form>
                </div>
            </b-container>
            <b-btn class="mt-3" 
                block variant="outline-danger"
                @click="hideModal">Close</b-btn>
        </b-modal>
    </div>
</template>

<script>
export default {
    props: [
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
            comments: [],
            loadPoint: 1,
            loadCount: 5,
            isEnd: false,
            commentRate: 0,
            commentContent: '',
            errMsg: ''
        }
    },
    computed: {
        CommentFeedback() { return this.errMsg ? true : false; }
    },
    methods: {
        showModal() { 
            this.$refs.modalRef.show(); 
            if (this.comments.length == 0) this.BringComments();
        },
        hideModal() { this.$refs.modalRef.hide(); },
        AddComment(evt) {
            evt.preventDefault();
            this.$http.post('api/comment', {
                movieID: this.MovieID,
                rate: this.commentRate,
                content: this.commentContent
            }, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage['token']}`
                }
            }).then((res) => {
                this.ReloadComments()
            }).catch(err => {
                var msg = '';
                if (err.response) { // Response Error
                    var res = err.response;
                    msg = res.data.message;
                } else if (err.request) { // Server Error
                    msg = err.message;
                } else { // Request Error
                    msg = err.message;
                }
                alert(msg);
            });

        },
        ReloadComments() {
            this.comments = [];
            this.loadPoint = 1;
            this.loadCount = 10;
            this.isEnd = false;
            this.BringComments();
        },
        DeleteComment(commentID) {
            this.$http.delete(`api/comment/${commentID}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage['token']}`
                }
            }).then((res) => {
                this.ReloadComments();
            }).catch(err => {
                var msg = '';
                if (err.response) { // Response Error
                    var res = err.response;
                    msg = res.data.message;
                } else if (err.request) { // Server Error
                    msg = err.message;
                } else { // Request Error
                    msg = err.message;
                }
                alert(msg);
            });
        },
        BringComments() {
            if (this.isEnd) return;
            this.$http.get('api/comment', {
                params: {
                    movieID: this.MovieID,
                    from: this.loadPoint,
                    to: this.loadPoint + this.loadCount - 1,
                }
            }).then((res) => {
                let data = res.data
                if (data.length > 0) {
                    this.comments.push(...data)
                    this.loadPoint += data.length;
                }
                if (data.length < this.loadCount || data.length <= 0) {
                    this.isEnd = true;
                }
            })
        }
    }
}
</script>
