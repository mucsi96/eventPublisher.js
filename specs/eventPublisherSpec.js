/*global $, EventPublisher, jasmine, describe,beforeEach,afterEach,it,expect, window*/

describe(
    'eventPublisher',
    function () {
        var ep = new EventPublisher(),
            MODULES = {},
            resolver = function (params) {
                params.deferred.resolve();
            };

        MODULES.ALPHA = 'alphaModule';
        MODULES.BRAVO = 'bravoModule';
        MODULES.CHARLIE = 'charlieModule';

        afterEach(function () {
            ep.reset();
        });

        describe('subscribe method', function () {
            it('is able to specify subscribing to events by module names', function (done) {
                var eventName = 'testEvent',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver),
                    alphaDone = false,
                    charlieDone = false,
                    allDone = function () {
                        expect(mySpy.calls.count()).toEqual(1);
                        done();
                    };

                ep.subscribe(eventName, MODULES.ALPHA, mySpy);
                ep.publish(eventName, MODULES.ALPHA).done(function () {
                    alphaDone = true;
                    if (alphaDone && charlieDone) {
                        allDone();
                    }
                });
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    charlieDone = true;
                    if (alphaDone && charlieDone) {
                        allDone();
                    }
                });

            });

            it('is able to subscribe to events by event name only', function (done) {
                var eventName = 'testEvent',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver),
                    alphaDone = false,
                    charlieDone = false,
                    allDone = function () {
                        expect(mySpy.calls.count()).toEqual(2);
                        done();
                    };

                ep.subscribe(eventName, null, mySpy);
                ep.publish(eventName, MODULES.ALPHA).done(function () {
                    alphaDone = true;
                    if (alphaDone && charlieDone) {
                        allDone();
                    }
                });
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    charlieDone = true;
                    if (alphaDone && charlieDone) {
                        allDone();
                    }
                });
            });

            it('is able to subscribe to events by module name only', function (done) {
                var mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(null, MODULES.ALPHA, mySpy);
                ep.publish('testEvent1', MODULES.ALPHA);
                ep.publish('testEvent2', MODULES.ALPHA).done(function () {
                    expect(mySpy.calls.count()).toEqual(2);
                    done();
                });

            });

            it('is able to subscribe multiple times to events', function (done) {
                var eventName = 'testEvent',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(eventName, null, mySpy);
                ep.subscribe(eventName, null, mySpy);
                ep.subscribe(eventName, null, mySpy);
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    expect(mySpy.calls.count()).toEqual(3);
                    done();
                });

            });
        });

        describe('publish method', function () {
            it('should be asynchronous', function (done) {
                var eventName = 'testEvent',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    expect(mySpy).toHaveBeenCalled();
                    done();
                });
                expect(mySpy).not.toHaveBeenCalled();
            });

            it('should be synchronous if forced', function () {
                var eventName = 'testEvent',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.publish(eventName, MODULES.CHARLIE, {}, true);
                expect(mySpy).toHaveBeenCalled();
            });

            it('should pass moduleName to event handler', function (done) {
                var eventName = 'testEventName',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    expect(mySpy.calls.mostRecent().args[0].moduleName).toEqual('charlieModule');
                    done();
                });
            });

            it('should pass eventName to event handler', function (done) {
                var eventName = 'testEventName',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    expect(mySpy.calls.mostRecent().args[0].eventName).toEqual('testEventName');
                    done();
                });
            });

            it('should pass data to event handler', function (done) {
                var eventName = 'testEventName',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver),
                    testData = {
                        success: 'yoyo'
                    };

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.publish(eventName, MODULES.CHARLIE, testData).done(function () {
                    expect(mySpy.calls.mostRecent().args[0].data.success).toEqual('yoyo');
                    done();
                });
            });

            it('should resolve publish promise if no listeners have subscribed', function (done) {
                var eventName = 'deferredNoHandlerTest';

                ep.publish(eventName, MODULES.ALPHA).done(function () {
                    expect(true).toBe(true);
                    done();
                });
            });
        });

        describe('unsubscribeAll method', function () {
            it('should not call event handlers on unsubscribed modules', function (done) {
                var eventName = 'testEventName',
                    mySpy = jasmine.createSpy('mySpy').and.callFake(resolver);

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.subscribe(eventName, MODULES.CHARLIE, mySpy);
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    ep.unsubscribeAll(eventName, MODULES.CHARLIE);
                    ep.publish(eventName, MODULES.CHARLIE).done(function () {
                        expect(mySpy.calls.count()).toBe(2);
                        done();
                    });
                });
            });
        });

        describe('unsubscribe method', function () {
            it('should remove only the passed handler', function (done) {
                var eventName = 'testEventName',
                    mySpy1 = jasmine.createSpy().and.callFake(resolver),
                    mySpy2 = jasmine.createSpy().and.callFake(resolver);

                ep.subscribe(eventName, MODULES.CHARLIE, mySpy1);
                ep.subscribe(eventName, MODULES.CHARLIE, mySpy2);
                ep.unsubscribe(eventName, MODULES.CHARLIE, mySpy1);
                ep.publish(eventName, MODULES.CHARLIE).done(function () {
                    expect(mySpy1.calls.count()).toEqual(0);
                    expect(mySpy2.calls.count()).toEqual(1);
                    done();
                });
            });
        });
    }
);