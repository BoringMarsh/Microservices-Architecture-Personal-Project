<template>
    <span class="button" :style="getBackgroundColor">
        <img :src="src" alt="image src invalid">
        <label> {{ detailName }} </label>
    </span>
    
</template>

<script>
export default {
    name: "detailIndexButton",
    props: {
        src: String,
        detailName: String,
        color: String
    },
    data() {
        return {

        }
    },
    methods: {
        getBackgroundColor: function() {
            return {
                backgroundColor: this.color
            }
        }
    }
}
</script>

<style scoped>
.button {
    position: relative;
    top: 15%;
    display: inline-block;
    margin-left: 1%;
    height: 70%;
    width: 8%;
    border-radius: 5px;
}
.button:hover {
    background-color: #00000050;
}
.button > img {
    position: relative;
    top: 18%;
    left: 8%;
    width: 20%;
}
.button > label {
    position: relative;
    top: 6%;
    left: 12%;
    font-size: larger;
    font-weight: lighter;
}
</style>