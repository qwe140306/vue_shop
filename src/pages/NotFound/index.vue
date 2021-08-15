<template>
	<div>
		<div class="box" >
			NotFound<br />
			404<br />
			<span ref="box"></span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'NotFound',
		
		methods: {
			yulumethods() {
				this.axios.get('https://api.oddfar.com/yl/q.php?c=1001&encode=text').then(value => {
					const str = value.data
					this.$refs.box.innerHTML = str
				});
			},
		},
		mounted() {
			this.yulumethods();
		},
	};
</script>

<style lang="less" scoped>
	div {
		font-size: 40px;
		font-weight: bold;
		color: #fff;
		background-color: #2b4b6b;
		width: 100%;
		height: 100%;
		text-align: center;
	}
	.box{
		height: 160px;
		position: absolute;
		top: 30%;
	}
</style>
