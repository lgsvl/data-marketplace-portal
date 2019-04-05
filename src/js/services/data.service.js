/**
 * Created by gina on 9/18/18.
 */
/**=========================================================
 * Module: data.service.js
 * Services to initialize data service
 =========================================================*/

(function() {
    'use strict';

    angular
        .module('app.data')
        .service('DataLoader', DataLoader)
        .service('CatalogLoader', CatalogLoader)
        .service('CategoryLoader', CategoryLoader)
        .service('ReviewLoader', ReviewLoader)
        .service('EventLoader', EventLoader)
        .service('TradeLoader', TradeLoader)
        .service('StreamLoader', StreamLoader)
        .service('ConsumerLoader', ConsumerLoader)

    DataLoader.$inject = ['$http', 'Config', '$localStorage'];
    function DataLoader($http, Config, $localStorage) {
        this.uploadFile = uploadFile;
        this.downloadFile = downloadFile;
        this.submitDataContractProposal = submitDataContractProposal;
        this.getBusinessNameById = getBusinessNameById;
        var self = this;
        ////////////////

        function uploadFile(contractId, formdata, onSuccess) {
            var request = {
                method: 'POST',
                url: Config.faisalSvcUrl + '/ipfs/',
                data: formdata,
                headers: {
                    'Content-Type': undefined,
                    'contractid': contractId,
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            // SEND THE FILES.
            $http(request)
                .success(function (result) {
                    onSuccess(result)
                })
                .error(function () {
                });
        }

        function downloadFile(contractId, hash, onReady) {
            var request = {
                method: 'GET',
                url: Config.faisalSvcUrl + '/ipfs/' + hash,
                responseType: 'arraybuffer',
                headers: {
                    'contractid': contractId,
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            $http(request)
                .success(function (data, status, headers) {
                    console.log("data", data)

                    var filename = headers['x-filename'];
                    var contentType = headers['content-type'];

                    var linkElement = document.createElement('a');
                    try {
                        var blob = new Blob([data], { type: contentType });
                        var url = window.URL.createObjectURL(blob);

                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", hash);

                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);

                    } catch (ex) {
                        console.log(ex);
                    }

                    onReady();
                })
                .error(function () {});
        }

        function submitDataContractProposal(metadata, onReady, onError) {
            console.log("metadata", metadata);
            var date = new Date();
            var timestamp = date.toISOString();
            var menuURL = Config.tradeSvcUrl +'/addDataContractEntry';
            var data = {
                "dataContractType": metadata.id,
                "consumer": $localStorage.jwtDecodedToken.iss,
                "dataContractId": uuidv4(),
                "dataContractTimestamp": timestamp,
                "extras": {
                    "endDateTime": metadata.extras.streamEndDateTime
                }
            };

            var request = {
                method: 'POST',
                url: menuURL,
                data: data,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function getBusinessNameById(id) {
            return self.businessDictionary[id].name;
        }
    }

    CatalogLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function CatalogLoader($http, Config, $state, $localStorage) {
        this.listCatalogEntries = listCatalogEntries;
        this.addCatalogEntry = addCatalogEntry;
        this.lookupCatalogEntriesByProvider = lookupCatalogEntriesByProvider;
        this.getCatalogEntriesByKeyword = getCatalogEntriesByKeyword;

        function listCatalogEntries(id, onReady, onError) {
            var url = '/listCatalogEntries'

            if(id !== undefined){
                url = '/lookupCatalogEntriesByCategory?id=' + id
            }

            var request = {
                method: 'GET',
                url: Config.catalogSvcUrl + url,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };


            onError = onError || function(error) {
                };

            $http(request)
                .success(function(result){onReady(result.response)})
                .error(onError);

        }

        function addCatalogEntry(metadata, onReady, onError) {
            var menuURL = Config.catalogSvcUrl+'/addCatalogEntry';
            var today = new Date();
            today = today.toISOString();
            var data = {
                "docType": "com.lge.svl.datamarketplace.contract.DataContractType",
                "name": metadata.title,
                "definition_format": "string",
                "id": uuidv4(),
                "categoryId":  metadata.category.id,
                "dataType": metadata.filetype.toUpperCase(),
                "numberOfReviews": 0,
                "creationDateTime": today,
                "priceType": {
                    "definition_format": "string",
                    "amount": Number(metadata.price),
                    "currency": "USD"
                },
                "description": metadata.description,
                "ownership": {
                    "docType": "com.lge.svl.datamarketplace.contract.Ownership",
                    "ownershipType": metadata.ownership,
                    "revocation": {
                        "revocationTime": "string",
                        "refundPolicy": "string"
                    },
                    "ownershipVerificationMethod": {
                        "attributeName": "string",
                        "hash": {
                            "method": "md5",
                            "value": "string"
                        }
                    }
                },
                "extras": {
                    "frequency": Number(metadata.frequency),
                    "streamEndPoint": metadata.streamEndPoint,
                    "streamTopic": metadata.streamTopic,
                    "definition_format": "string",
                    "startTime": today,
                    "endTime": "2020-01-01T00:00:00Z"
                },
                "provider": $localStorage.jwtDecodedToken.iss,
                "reviews": [],
                "thumbnailURL": metadata.thumbnailUrl,
                "status": "ACTIVE"

            };

            console.log("addCatalog", data);

            var request = {
                method: 'POST',
                url: menuURL,
                data: data,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function lookupCatalogEntriesByProvider(id, onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.catalogSvcUrl + '/lookupCatalogEntriesByProvider?id=' + id,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
            };

            $http(request)
                .success(function (result) {
                    onReady(result.response)
                })
                .error(onError);
        }

        function getCatalogEntriesByKeyword(keyword, onReady, onError) {
            var url = 'https://search.datagraviti.com/_search';

            var data = {
                "query": {
                    "match" : {
                        "description" : {
                            "query" : "dentists of Santa clara",
                            "operator" : "and"
                        }
                    }
                }
            };

            var request = {
                method: 'GET',
                url: url,
                data: data,
                headers: {
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(function(result){onReady(result.hits.hits)})
                .error(onError);

        }
    }

    CategoryLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function CategoryLoader($http, Config, $state, $localStorage) {
        this.listCategoryEntries = listCategoryEntries;
        this.listPopularCategories = listPopularCategories

        function listCategoryEntries(onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.categorySvcUrl + '/listCategoryEntries',
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
            };

            $http(request)
                .success(function (result) {
                    onReady(result.response)
                })
                .error(onError);
        }

        function listPopularCategories(onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.categorySvcUrl + '/lookupPopularCategories?size=8',
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
            };

            $http(request)
                .success(function (result) {
                    onReady(result.response)
                })
                .error(onError);
        }
    }

    ReviewLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function ReviewLoader($http, Config, $state, $localStorage) {
        this.listReviewEntries = listReviewEntries;
        this.addReviewEntry = addReviewEntry;


        function listReviewEntries(onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.reviewSvcUrl+'/listReviewEntries',
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function addReviewEntry(dataset, onReady, onError) {
            var menuURL = Config.reviewSvcUrl +'/addReviewEntry';
            var data = {
                "docType": "com.lge.svl.datamarketplace.contract.Review",
                "id": uuidv4(),
                "reviewText": dataset.review.reviewText,
                "score": Number(dataset.review.score),
                "dataContract": dataset.contract.id,
                "reviewer": dataset.contract.consumer
            };
            var request = {
                method: 'POST',
                url: menuURL,
                data: data,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };


            onError = onError || function(error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function uuidv4() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }

    EventLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function EventLoader($http, Config, $state, $localStorage) {
        this.listPurchased = listPurchased;
        this.listSold = listSold;
        this.getDetails = getDetails;

        function listPurchased(status, onReady, onError) {
            var param ='';
            if (status == 'Downloaded')
                param = '/lookupBusinessDataSetsPurchasedDownloaded';
            else if (status == 'NotUploaded')
                param = '/lookupBusinessDataSetsPurchasedNotUploaded';
            else if (status == 'UploadedNotDownloaded')
                param = '/lookupBusinessDataSetsPurchasedUploadedNotDownloaded';
            else
                param = '/lookupBusinessDataSetsByConsumer'

            var today = new Date();
            today = today.toISOString();
            var menuURL = Config.tradeSvcUrl + param;
            var data = '?id=' + $localStorage.jwtDecodedToken.iss + '&today=' + today;

            menuURL = menuURL + data;

            var request = {
                method: 'GET',
                url: menuURL,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(function(result){
                    onReady(result.response)
                })
                .error(onError);
        }


        function listSold(status, onReady, onError) {
            var param ='';
            if (status == 'ToUpload')
                param = '/lookupBusinessDataSetsToUpload';
            else if (status == 'SoldAndDownloaded')
                param = '/lookupBusinessDataSetsSoldAndDownloaded';
            else
                param = '/lookupBusinessDataSetsSoldShippedNotDownloaded';

            var today = new Date();
            today = today.toISOString();
            var menuURL = Config.tradeSvcUrl + param;
            var data = '?id=' + $localStorage.jwtDecodedToken.iss;
            menuURL = menuURL + data;

            var request = {
                method: 'GET',
                url: menuURL,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function(error) {
                };

            $http(request)
                .success(function(result){ onReady(result.response)})
                .error(onError);
        }
        function getDetails(datasets, onSuccess) {
            //commented out for javascript version

            var requests = datasets.map(data => {
                return fetch(Config.catalogSvcUrl + '/lookupCatalogEntry?id=' + data.dataContractType, {
                    method: "GET", // *GET, POST, PUT, DELETE, etc.
                    headers: {
                        "Authorization": 'user ' + $localStorage.token
                    }
                })
                    .then(res => res.json())
                    .then(json => {
                        return json.response
                    })
            });

            Promise.all(requests).then(res => {
                onSuccess(res);
            });
        }
    }

    TradeLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function TradeLoader($http, Config, $state, $localStorage) {
        this.getReviewById = getReviewById;
        this.lookupBusinessDataSetsByCatalogEntry = lookupBusinessDataSetsByCatalogEntry;
        this.lookupNumberOfBusinessDataSetsToUpload = lookupNumberOfBusinessDataSetsToUpload;
        this.getBusinessEntries = getBusinessEntries;

        function getReviewById(id, onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.tradeSvcUrl + '/lookupBusinessReviewsByContractType?id=' + id,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function lookupBusinessDataSetsByCatalogEntry(id, onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.tradeSvcUrl + '/lookupBusinessDataSetsByCatalogEntry?id=' + id,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(function (result) {
                    onReady(result.response)
                })
                .error(onError);
        }

        function lookupNumberOfBusinessDataSetsToUpload(id, onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.tradeSvcUrl + '/lookupNumberOfBusinessDataSetsToUpload?id=' + id,
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(function (result) {
                    onReady(result.response)
                })
                .error(onError);
        }

        function getBusinessEntries(onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.tradeSvcUrl + '/listBusinessEntries',
                headers: {
                    "Authorization": 'user ' + $localStorage.token
                }
            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(function (result) {
                    onReady(result.response)
                })
                .error(onError);
        }

    }

    StreamLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function StreamLoader($http, Config, $state, $localStorage) {
        this.pullPushStream = pullPushStream;
        this.createTopic = createTopic;
        var self = this;

        function pullPushStream(id, endPoint, topic, onReady, onError) {
            var data = {
                "DataContractTypeID": id,
                "DataStreamProtocol":"KAFKA",
                "DataStreamSourceURL": endPoint,
                "DataStreamDestinationURL":"kafka-svc:9093",
                "DataStreamTopic":topic
            };

            var request = {
                method: 'POST',
                url: Config.streamSvcUrl + '/pullpushstream',
                data: data,
                headers: {
                    "Content-Type": "text/plain",
                    "Authorization": 'user ' + $localStorage.token

                }
            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }
        function createTopic(id, onReady, onError) {
            var id = id.replace(/-/g, "");

            var data = {"records":[{"key":"key","value":"value"},{"value":"value","partition":"0"},{"value":"value"}]};
            var url = 'https://kafka.datagraviti.com/topics/' + id;
            self.pushEndPoint = url;
            self.pushTopic = id;
            var request = {
                method: 'POST',
                url: url,
                data: data,
                headers: {

                    "Content-Type": 'application/vnd.kafka.json.v2+json',
                    "Accept": "application/vnd.kafka.v2+json, application/vnd.kafka+json, application/json"
                }
            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

    }

    ConsumerLoader.$inject = ['$http', 'Config', '$state', '$localStorage'];
    function ConsumerLoader($http, Config, $state, $localStorage) {
        this.createConsumer = createConsumer;
        this.subscribeTopic = subscribeTopic;
        this.collectingData = collectingData;

        function createConsumer(id, onReady, onError) {
            var data = {
                "name": id,
                "format":"json",
                "auto.offset.reset":"earliest"
            };

            var request = {
                method: 'POST',
                url: Config.streamConsumptionSvcUrl + '/' + id,
                data: data,
                headers: {
                    "Content-Type": "application/vnd.kafka.v2+json",
                    "Accept": "application/vnd.kafka.v2+json"
                }
            };

            onError = onError || function (error)
                {
                    if (error.error_code == 40902) {
                        onReady();
                    }
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }
        function subscribeTopic(id, topic, onReady, onError) {
            var data = {
                "topics":[topic]
            };

            var request = {
                method: 'POST',
                url: Config.streamConsumptionSvcUrl + '/' + id + '/instances/' + id + '/subscription',
                data: data,
                headers: {
                    "Content-Type": "application/vnd.kafka.v2+json"
                }

            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

        function collectingData(id, onReady, onError) {
            var request = {
                method: 'GET',
                url: Config.streamConsumptionSvcUrl + '/' + id + '/instances/' + id + '/records?' + '&max_bytes=300000',
                headers: {
                    "Accept": "application/vnd.kafka.json.v2+json"
                }

            };

            onError = onError || function (error) {
                };

            $http(request)
                .success(onReady)
                .error(onError);
        }

    }

})();
