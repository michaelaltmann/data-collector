import React, { Component } from 'react'
import { API } from 'aws-amplify'
import {
    Button,
    Icon,
    Paper,
    TextField,
} from '@material-ui/core';

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
            data: {},
            observation: {},
            modified: false
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
    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ ...this.state, item: value, modified: true })
    }
    async handleSubmit() {
        const { item } = this.state;
        const apiName = 'observation';
        const path = '/item';
        let init = {
            body: JSON.parse(item)
        }
        const response = await API.put(apiName, path, init)
        this.setState({ ...this.state, item: item, modified: false })
    }
    async listItems(previousList) {
        if (previousList && !previousList.LastEvaluatedKey) {
            // Already got everything
            return previousList
        }
        const studyName = 'image';
        const apiName = 'observation';
        const path = '/item/' + studyName;
        const init = {
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
        return (
            <React.Fragment >
                { this.renderForm()}
                { this.renderList()}
            </React.Fragment >
        )
    }


    renderForm() {
        const { item } = this.state
        const modified = true
        return (
            <Paper>
                <TextField
                    value={item}
                    name='observation'
                    label='observation'
                    onChange={this.handleChange.bind(this)}
                    fullWidth={true}
                    multiline={true}
                    rows={8}
                    rowsMax={10}
                />
                <br></br>
                <Button
                    onClick={this.handleSubmit.bind(this)}
                    variant="outlined"
                > Save
                </Button>
            </Paper >
        )
    }

    renderList() {
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
                            return (<div>{JSON.stringify(item)}</div>)
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