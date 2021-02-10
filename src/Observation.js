import React, { Component } from 'react'
import { API } from 'aws-amplify'

import { withStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroller'
const styles = () => ({
    centered: {
        marginLeft: '50%',
    },
});

class Observation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    async componentDidMount() {
        await this.refreshList()
    }
    async refreshList() {
        const newList = await this.listItems(null)
        this.setState({ ...this.state, data: newList });
    }
    async fetchMore() {
        const { data } = this.state
        const newList = await this.listItems(data)
        this.setState({ ...this.state, data: newList });
    }
    async listItems(previousList) {
        if (previousList && !previousList.LastEvaluatedKey) {
            // Already got everything
            return previousList
        }
        const studyName = 'image';
        let apiName = 'observation';
        let path = '/item/' + studyName;
        let init = {
            queryStringParameters: {}
        }

        if (previousList && previousList.LastEvaluatedKey) {
            init.queryStringParameters.LastEvaluatedKey =
                encodeURIComponent(JSON.stringify(previousList.LastEvaluatedKey))
        }

        const response = await API.get(apiName, path, init)
        var list = {
            items: response.Items,
            LastEvaluatedKey: response.LastEvaluatedKey
        }

        if (previousList && previousList.items) {
            list.items = previousList.items.concat(list.items)
        }
        return list
    }
    render() {
        const { classes } = this.props
        const { data } = this.state
        if (data && data.items) {
            const items = data.items
            return (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.fetchMore.bind(this)}
                    hasMore={data.LastEvaluatedKey != null}
                    loader={<CircularProgress className={classes.centered} />}
                >
                    {
                        items.map(item => {
                            return (<div>{JSON.strigify(item)}</div>)
                        })
                    }

                </InfiniteScroll>
            )
        } else {
            return (
                <CircularProgress className={classes.centered} />
            )
        }
    }
}
export default withStyles(styles)(Observation)