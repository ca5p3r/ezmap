const LandingPage = () => {
    return (
        <div className="landing">
            <section style={{ height: '100%' }} className="bg-light pt-5 pb-6">
                <div className="landing-header">
                    <div className="container">
                        <div className="row mt-6">
                            <div className="col-md-8 mx-auto text-center">
                                <h1>A simple map for everyone</h1>
                                <p className="lead mb-5">EasyMap is a lightweight, extensible map toolbox, built with modern web standards in mind. It can be used by many GIS developers, analysts, researchers and engineers.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="landing-footer">
                    <footer className="py-5 bg-light">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <ul className="list-inline">
                                        <li className="list-inline-item"><a href="https://github.com/ca5p3r/ezmap">Fork EasyMap on GitHub</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row my-2">
                                <div className="col-md-4 mx-auto text-muted text-center small-xl">
                                    &copy; 2021 EasyMap - All Rights Reserved
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </section>
        </div>
    );
};
export default LandingPage;