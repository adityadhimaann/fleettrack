<script>
        const images = [
            "/images/fleet1.jpg",
            "/images/fleet2.jpeg",
            "/images/fleet3.png"
        ];
        let currentIndex = 0;
        function addimage(index){
            currentIndex = index;
            document.getElementById("imagemodal"),src=images
            [currentIndex];
            document.getElementById("modal").classList.remove("hidden");
        }