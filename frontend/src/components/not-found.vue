<template>
    <b-container class="p-5">
        <h1>Sorry, this page is not supported!</h1>
        <p>You may accessed wrong page or urls that server does not serve.</p>
        <p>And will be automatically redirected to our home page in {{ remaining }} seconds</p>
    </b-container>
</template>

<script>
export default {
    data: function() {
        return {
            remaining: 10
        }
    },
    created() {
        var timerID = setInterval(() => {
            if (--this.remaining === 0) {
                this.$router.replace({ name: 'home' })
                clearInterval(timerID)
            }
        }, 1000);
    }
}
</script>
