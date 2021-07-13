import { Container, Row, Col } from "react-bootstrap";

const LandingPage = () => {
    return (
        <div>
            <section class="bg-gradient pt-5 pb-6">
                <div class="container">
                    <div class="row mt-6">
                        <div class="col-md-8 mx-auto text-center">
                            <h1>A simple map for everyone</h1>
                            <p class="lead mb-5">EasyMap is a lightweight, extensible map toolbox, built with modern web standards in mind. It can be used by many GIS developers, analysts, researchers and engineers.</p>
                        </div>
                    </div>
                    <div class="row mt-5">
                        <div class="col-md-9 mx-auto">
                            <div class="code-window">
                                <div class="dots">
                                    <div class="red"></div>
                                    <div class="orange"></div>
                                    <div class="green"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="py-5 bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center">
                            <ul class="list-inline">
                                <li class="list-inline-item"><a href="https://prismjs.com/test.html">Test Drive</a></li>
                                <li class="list-inline-item"><a href="https://prismjs.com/extending.html">API Docs</a></li>
                                <li class="list-inline-item"><a href="https://github.com/LeaVerou/prism/">Fork Prism.js on
                                    GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-md-4 mx-auto text-muted text-center small-xl">
                            &copy; 2019 Prism - All Rights Reserved
                        </div>
                    </div>
                </div>
            </footer>
        </div>

    );
}

export default LandingPage;